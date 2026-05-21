import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, X, Loader2, MessageSquare, CornerDownRight, Users, AtSign, List } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ActivityLogChats from '../../components/Layout/ActivityLog/ActivityLogChats';
import {
  useActivityLogsList,
  useAddActivityLogComment,
  useUpdateActivityLogComment,
  useDeleteActivityLogComment,
  useActivityMentions
} from '../../hooks/activity-logs/useActivityLogs';
import useListUsers from '../../hooks/Users/useListUsers';
import userProfileOptions from '../../hooks/auth/userProfileOptions';
import { useRFQDetails } from '../../hooks/rfqs/useRFQs';

export default function ActivityLog({
  modelType,
  modelId,
  isDrawer = false,
  onClose
}) {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // { id, user: { name } }
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mentions'
  
  // Suggestion State
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // RFQ Details query to determine if it is a purchase order
  const { data: rfqDetails } = useRFQDetails(modelType === 'rfq' ? modelId : null);

  const activeModelType = useMemo(() => {
    if (modelType === 'rfq' && rfqDetails?.data?.is_purchase_order) {
      return 'purchase_order';
    }
    return modelType;
  }, [modelType, rfqDetails]);

  // Queries & Mutations
  const { data: logsData, isLoading: isLogsLoading } = useActivityLogsList(activeModelType, modelId);
  const { data: mentionsData, isLoading: isMentionsLoading } = useActivityMentions();

  const { data: usersResponse } = useListUsers({ per_page: 100 });
  const { data: profileResponse } = useQuery(userProfileOptions());

  const addMutation = useAddActivityLogComment();
  const updateMutation = useUpdateActivityLogComment(activeModelType, modelId);
  const deleteMutation = useDeleteActivityLogComment(activeModelType, modelId);

  const rawData = activeTab === 'all' ? logsData : mentionsData;
  const comments = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  const users = Array.isArray(usersResponse) ? usersResponse : (usersResponse?.data || []);
  const currentUser = profileResponse?.data || profileResponse;

  // Auto-scroll to bottom of chat logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments, isLogsLoading]);

  useEffect(() => {
    console.log("ActivityLog: Rendered with activeModelType:", activeModelType, "modelId:", modelId, "Comments count:", comments.length);
  }, [activeModelType, modelId, comments]);

  // Filter users based on query in mention trigger
  const matchedUsers = useMemo(() => {
    if (!suggestionQuery) return users.slice(0, 5);
    return users.filter((u) =>
      u.name.toLowerCase().includes(suggestionQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(suggestionQuery.toLowerCase())
    ).slice(0, 5);
  }, [users, suggestionQuery]);

  // Handle typing to trigger @mentions
  const handleInputChange = (e) => {
    const val = e.target.value;
    setCommentText(val);

    const selectionStart = e.target.selectionStart;
    setCursorPosition(selectionStart);

    const textBeforeCursor = val.substring(0, selectionStart);
    const lastAtIdx = textBeforeCursor.lastIndexOf('@');

    if (lastAtIdx !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIdx + 1);
      // Ensure there are no spaces between the '@' and the cursor
      if (!textAfterAt.includes(' ')) {
        setSuggestionQuery(textAfterAt);
        setShowSuggestions(true);
        setSuggestionIndex(0);
        return;
      }
    }
    setShowSuggestions(false);
  };

  const selectUserSuggestion = (user) => {
    const textBeforeAt = commentText.substring(0, commentText.lastIndexOf('@'));
    const textAfterCursor = commentText.substring(cursorPosition);
    const newText = `${textBeforeAt}@[${user.id}] ${textAfterCursor}`;

    setCommentText(newText);
    setShowSuggestions(false);

    // Refocus & set cursor
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = textBeforeAt.length + `@[${user.id}] `.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev + 1) % matchedUsers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev - 1 + matchedUsers.length) % matchedUsers.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (matchedUsers[suggestionIndex]) {
          selectUserSuggestion(matchedUsers[suggestionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  // Helper to pull mentions array out of comments string
  const extractMentionedUserIds = (text) => {
    const regex = /@\[(\d+)\]/g;
    const ids = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const id = parseInt(match[1], 10);
      if (!ids.includes(id)) {
        ids.push(id);
      }
    }
    return ids;
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const mentionedIds = extractMentionedUserIds(commentText);

    const body = {
      model_type: activeModelType,
      model_id: parseInt(modelId, 10),
      comment: commentText,
      mentioned_user_ids: mentionedIds,
      parent_id: replyingTo ? replyingTo.id : null
    };

    console.log("model_id", modelId);

    addMutation.mutate(
      { body },
      {
        onSuccess: () => {
          setCommentText('');
          setReplyingTo(null);
        }
      }
    );
  };

  const handleEditComment = (id, newText) => {
    const mentionedIds = extractMentionedUserIds(newText);
    updateMutation.mutate({
      id,
      body: {
        comment: newText,
        mentioned_user_ids: mentionedIds
      }
    });
  };

  const handleDeleteComment = (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate({ id });
    }
  };

  const containerClasses = isDrawer
    ? 'h-full flex flex-col bg-white'
    : 'fixed top-5 bottom-5 right-3 w-[350px] rounded-main bg-white border-r border-[#E6EFF5] shadow-main flex flex-col z-[100]';

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-white shrink-0 rounded-t-main">
        <div className="flex gap-2 items-center">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <MessageSquare size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-secondary">Activity Chat Log</p>
            <p className="text-[10px] text-slate-400 capitalize">
              {modelType?.replace('_', ' ')} #{modelId}
            </p>
          </div>
        </div>
        {onClose && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-slate-400 hover:text-secondary rounded-full"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2 gap-4 border-b bg-white">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 text-xs font-bold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeTab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <List size={14} />
          All Activity
        </button>
        <button
          onClick={() => setActiveTab('mentions')}
          className={`pb-2 text-xs font-bold transition-colors flex items-center gap-1.5 border-b-2 ${
            activeTab === 'mentions'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <AtSign size={14} />
          My Mentions
        </button>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-white" style={{ scrollbarWidth: 'thin' }}>
        {isLogsLoading || isMentionsLoading ? (
           <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <Loader2 className="animate-spin mb-2" size={24} />
             <p className="text-xs">Loading...</p>
           </div>
         ) : (
           <ActivityLogChats
             comments={comments}
             users={users}
             currentUser={currentUser}
             onReply={setReplyingTo}
             onEdit={handleEditComment}
             onDelete={handleDeleteComment}
           />
         )}
       </div>

      {/* Reply bar indicator */}
      {replyingTo && (
        <div className="px-4 py-2 border-t bg-slate-50 flex justify-between items-center shrink-0">
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <CornerDownRight size={14} className="text-primary" />
            Replying to <span className="font-bold">@{replyingTo.user?.name || 'System'}</span>
          </p>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white shrink-0 rounded-b-main relative">
        {/* Mention Suggestions Popover */}
        {showSuggestions && matchedUsers.length > 0 && (
          <div className="absolute bottom-[90%] left-4 right-4 bg-white border border-slate-200 rounded-xl shadow-xl z-[200] max-h-40 overflow-y-auto p-1.5 flex flex-col gap-0.5">
            <p className="text-[10px] text-slate-400 px-2 py-1 font-bold flex items-center gap-1">
              <Users size={10} /> Mention user...
            </p>
            {matchedUsers.map((u, i) => (
              <button
                key={u.id}
                onClick={() => selectUserSuggestion(u)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  i === suggestionIndex
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-inner">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span>{u.name}</span>
                  <span className="text-[9px] text-slate-400 font-normal">{u.email}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="w-full flex flex-col bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-inner">
            <textarea
              ref={inputRef}
              rows={1}
              value={commentText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... Use @ to mention someone"
              className="w-full bg-transparent border-none outline-none resize-none text-slate-700 text-sm py-1 px-1 focus:ring-0 placeholder:text-slate-400"
              style={{ maxHeight: '100px', scrollbarWidth: 'thin' }}
            />
          </div>
          <Button
            onClick={handleSendComment}
            disabled={addMutation.isPending || !commentText.trim()}
            className="rounded-2xl h-10 w-10 p-0 shrink-0 bg-primary hover:bg-primary/95 text-white shadow-md flex items-center justify-center transition-all disabled:opacity-50"
          >
            {addMutation.isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
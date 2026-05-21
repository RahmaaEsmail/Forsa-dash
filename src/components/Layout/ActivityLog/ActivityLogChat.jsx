import React, { useState } from 'react';
import { Edit2, Trash2, CornerDownRight, X, Check } from 'lucide-react';
import dayjs from 'dayjs';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

export default function ActivityLogChat({
  comment,
  users = [],
  currentUser,
  onReply,
  onEdit,
  onDelete,
  depth = 0
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment?.comment || '');

  // Render parsed mention format: @[id] -> @UserName
  const renderCommentContent = (text) => {
    if (!text) return '';
    const regex = /@\[(\d+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      const userId = parseInt(match[1], 10);

      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const user = users.find((u) => u.id === userId);
      const userName = user ? user.name : `User #${userId}`;

      parts.push(
        <span
          key={matchIndex}
          className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-xs"
        >
          @{userName}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const isAuthor = currentUser && (comment?.user?.id === currentUser?.id || comment?.user_id === currentUser?.id);
  const initials = comment?.user?.name
    ? comment.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    onEdit(comment.id, editText);
    setIsEditing(false);
  };

  const formattedTime = comment?.created_at && dayjs(comment.created_at).isValid()
    ? dayjs(comment.created_at).format('h:mm a')
    : '';

  return (
    <div className={`flex flex-col gap-2 ${depth > 0 ? 'ml-8 pl-4 border-l-2 border-slate-100' : ''}`}>
      <div className="flex gap-3 items-start group">
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0 shadow-inner">
          {initials}
        </div>

        {/* Comment Content Card */}
        <div className="bg-slate-50 border border-slate-100 w-full p-3.5 rounded-2xl hover:bg-slate-100/50 transition-colors relative">
          <div className="flex justify-between items-center gap-2 mb-1">
            <h4 className="font-bold text-secondary text-sm">
              {comment?.user?.name || 'System Log'}
            </h4>
            <span className="text-slate-400 text-[10px]">
              {formattedTime}
            </span>
          </div>

          {/* Edit mode / normal mode */}
          {isEditing ? (
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="h-8 text-sm focus-visible:ring-1"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveEdit}
                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 shrink-0"
              >
                <Check size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 text-red-500 hover:text-red-600 shrink-0"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <p className="text-slate-700 text-sm font-normal leading-relaxed break-words whitespace-pre-wrap">
              {renderCommentContent(comment?.comment || comment?.message || comment?.description || '')}
            </p>
          )}

          {/* Actions - Reply, Edit, Delete */}
          {!isEditing && (
            <div className="flex items-center gap-3 mt-2 pt-1.5 border-t border-slate-200/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onReply(comment)}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
              >
                <CornerDownRight size={12} />
                Reply
              </button>
              {isAuthor && (
                <>
                  <button
                    onClick={() => {
                      setEditText(comment?.comment || '');
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-700"
                  >
                    <Edit2 size={11} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Render Nested Replies */}
      {comment?.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-3 mt-1">
          {comment.replies.map((reply) => (
            <ActivityLogChat
              key={reply.id}
              comment={reply}
              users={users}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

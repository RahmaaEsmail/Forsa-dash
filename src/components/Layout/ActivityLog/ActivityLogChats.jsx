import React from 'react';
import ActivityLogChat from './ActivityLogChat';
import dayjs from 'dayjs';

export default function ActivityLogChats({
  comments = [],
  users = [],
  currentUser,
  onReply,
  onEdit,
  onDelete
}) {
  // Organize comments into a tree based on parent_id
  const organizeComments = (commentsList) => {
    if (!commentsList || !Array.isArray(commentsList)) return [];

    // Deep flatten in case API already returned some nested replies to avoid duplication
    const flatten = (list) => {
      let items = [];
      list.forEach(item => {
        items.push(item);
        if (item.replies?.length > 0) items.push(...flatten(item.replies));
      });
      return items;
    };

    const cleanList = flatten(commentsList).filter(c => c && typeof c === 'object' && c.id !== undefined);
    const commentMap = {};
    const rootComments = [];

    // First pass: create deep clones and initialize empty replies arrays
    cleanList.forEach((c) => {
      commentMap[c.id] = { ...c, replies: [] };
    });

    // Second pass: associate children with parents, or push to root
    cleanList.forEach((c) => {
      if (c.parent_id) {
        const parent = commentMap[c.parent_id];
        if (parent) {
          parent.replies.push(commentMap[c.id]);
        } else {
          rootComments.push(commentMap[c.id]);
        }
      } else {
        rootComments.push(commentMap[c.id]);
      }
    });

    return rootComments;
  };

  const rootComments = organizeComments(comments);

  // Group root-level comments by date
  const groupCommentsByDate = (list) => {
    const groups = {};
    list.forEach((c) => {
      const dateLabel = getGroupLabel(c.created_at || new Date());
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(c);
    });
    return groups;
  };

  const getGroupLabel = (dateStr) => {
    if (!dateStr) return 'Other';
    const d = dayjs(dateStr);
    if (!d.isValid()) return 'Other';
    if (d.isSame(dayjs(), 'day')) return 'Today';
    if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
    return d.format('MMMM DD, YYYY');
  };

  const grouped = groupCommentsByDate(rootComments);

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <img
          src="/images/streamline-logos_google-chat-logo-solid.svg"
          className="w-10 h-10 opacity-30 mb-3 filter grayscale"
          alt="Chat icon"
        />
        <p className="text-slate-400 text-sm font-semibold">No Activity Log Found</p>
        <p className="text-xs text-slate-400/80 mt-1 max-w-[200px]">
          Type a message below to start logging notes or updates.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([dateLabel, items]) => (
        <div key={dateLabel} className="flex flex-col gap-4">
          {/* Date Separator */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-slate-100" />
            <p className="whitespace-nowrap rounded-full px-3 py-0.5 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 tracking-wider">
              {dateLabel}
            </p>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Date Group Items */}
          <div className="flex flex-col gap-5">
            {items.map((comment) => (
              <ActivityLogChat
                key={comment.id}
                comment={comment}
                users={users}
                currentUser={currentUser}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import { apiInstance } from "../api/apiInstance";
import { userEndpoints } from "../api/userEndpoints";

export const handleGetAllNotifications = async ({ signal, params }) => {
  const response = await apiInstance.get(userEndpoints.notifications, {
    signal,
    params,
  });
  return response.data;
};

export const handleCreateNotification = async ({ body, signal }) => {
  const response = await apiInstance.post(userEndpoints.notifications, body, {
    signal,
  });
  return response.data;
};

export const handleDeleteNotification = async ({ id, signal }) => {
  const response = await apiInstance.delete(`${userEndpoints.notifications}/${id}`, {
    signal,
  });
  return response.data;
};

export const handleMarkNotificationRead = async ({ id, signal }) => {
  const url = userEndpoints.mark_notification_read.replace(":id", id);
  const response = await apiInstance.post(url, {}, { signal });
  return response.data;
};

export const handleMarkAllNotificationsRead = async ({ signal }) => {
  const response = await apiInstance.post(
    userEndpoints.mark_all_notifications_read,
    {},
    { signal }
  );
  return response.data;
};

export const handleGetUnreadNotificationsCount = async ({ signal }) => {
  const response = await apiInstance.get(userEndpoints.unread_notifications_count, {
    signal,
  });
  return response.data;
};

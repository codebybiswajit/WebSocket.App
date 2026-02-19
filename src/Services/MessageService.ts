import axios from "axios";

interface MessageResponse {
    id: string;
    fromUserId: string;
    fromUsername: string;
    toUserId: string;
    message: string;
    timestamp: string;
}

class MessageReturnServices {
    route = '/api/message';

    /**
     * Fetch chat history between two users.
     * @param userId - Current user ID
     * @param contactId - Contact/friend user ID
     * @param page - Page number for pagination (default: 0)
     */
    getMessages = async (userId: string, contactId: string, page: number = 0) => {
        return await axios.get<{ result: MessageResponse[] }>(`${this.route}/conversation/${userId}/${contactId}?page=${page}`);
    };

    /**
     * Get all message counts by conversation.
     * @param userId - Current user ID
     */
    getUnreadCounts = async (userId: string) => {
        return await axios.get<Record<string, number>>(`${this.route}/unreadcounts/${userId}`);
    };

    /**
     * Mark messages as read for a specific conversation.
     * @param userId - Current user ID
     * @param contactId - Contact/friend user ID
     */
    markAsRead = async (userId: string, contactId: string) => {
        return await axios.post(`${this.route}/markasread/${userId}/${contactId}`, {});
    };
}

export default new MessageReturnServices();

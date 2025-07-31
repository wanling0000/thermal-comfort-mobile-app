import {request} from "../../utils/request.ts";
import {FeedbackResponse, FeedbackWithReadingInput} from '../../types/Feedback';

interface ApiResponse<T> {
    code: string;
    info: string;
    data: T;
}

export const FeedbackService = {
    submitFeedbackWithReading: async (input: FeedbackWithReadingInput) => {
        return request('/api/v1/feedback/submit-with-reading', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    getFeedbackByMonth: async (year: number, month: number): Promise<FeedbackResponse[]> => {
        const url = `/api/v1/feedback/by-month?year=${year}&month=${month}`;

        const res: ApiResponse<FeedbackResponse[]> = await request(url, {
            method: 'GET',
        });

        if (!res || !Array.isArray(res.data)) {
            throw new Error('[getFeedbackByMonth] response.data is not an array');
        }

        return res.data;
    },

    getLatestFeedback: async (): Promise<FeedbackResponse[]> => {
        const res: ApiResponse<FeedbackResponse[]> = await request(
            '/api/v1/feedback/latest',
            { method: 'GET' }
        );

        return res.data;
    },

    updateFeedback: async (input: FeedbackResponse) => {
        console.log("[📡 updateFeedback] Input sent to backend:", JSON.stringify(input, null, 2));

        return request('/api/v1/feedback/update', {
            method: 'PUT',
            body: JSON.stringify(input),
        });
    },

    deleteFeedback: async (id: string | number) => {
        return request(`/api/v1/feedback/delete/${id}`, {
            method: 'DELETE',
        });
    },
};


import {request} from "../../utils/request.ts";
import {FeedbackInput, FeedbackWithReadingInput} from '../../types/Feedback';

interface FeedbackResponse {
    code: string;
    info: string;
    data: FeedbackInput[];
}
export const FeedbackService = {
    submitFeedbackWithReading: async (input: FeedbackWithReadingInput) => {
        return request('/api/v1/feedback/submit-with-reading', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    getFeedbackByMonth: async (year: number, month: number): Promise<FeedbackInput[]> => {
        const res = await request(`/api/v1/feedback/by-month?year=${year}&month=${month}`, {
            method: 'GET',
        });
        // res 是 { code, info, data }，但 request() 内部不处理结构，所以这里解包
        if (!res || !Array.isArray(res.data)) {
            throw new Error('[getAllFeedback] response.data is not an array');
        }

        return res.data;
    },

    getLatestFeedback: async (): Promise<FeedbackInput> => {
        return request('/api/v1/feedback/latest', {
            method: 'GET',
        });
    },

};


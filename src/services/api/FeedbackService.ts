import {request} from "../../utils/request.ts";
import { FeedbackWithReadingInput } from '../../types/Feedback';

export const FeedbackService = {
    submitFeedbackWithReading: async (input: FeedbackWithReadingInput) => {
        return request('/api/v1/feedback/submit-with-reading', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },
};

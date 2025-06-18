import {request} from "../../utils/request.ts";
import { FeedbackWithReadingInput } from '../../types/Feedback';

export const FeedbackService = {
    submitFeedbackWithReading: async (input: FeedbackWithReadingInput) => {
        return request('/api/v1/feedback/submit-with-reading', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    getAllFeedback: async () => {
        // return request('/api/v1/feedback/all', {
        //     method: 'GET',
        // });
        return [
            {
                feedback_id: 'c932ea90-eb2e-461b-b03a-7b86d98179fa',
                user_id: 'admin',
                timestamp: new Date('2025-05-23T01:23:54.746Z').getTime(),
                comfort_level: 0,
                feedback_type: 'quick',
                notes: null,
                location_display_name: 'Greenfields Road',
                raw_coordinates: {
                    latitude: 53.28596538772052,
                    longitude: -9.073620818030198,
                },
            },
            {
                feedback_id: 'abc123',
                user_id: 'admin',
                timestamp: new Date('2025-05-23T18:00:00Z').getTime(),
                comfort_level: 2,
                feedback_type: 'quick',
                notes: null,
                location_display_name: 'City Center Plaza',
                raw_coordinates: {
                    latitude: 53.27,
                    longitude: -9.05,
                },
            },
        ];
    },
};


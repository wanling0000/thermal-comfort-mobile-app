import React, { createContext, useContext, useState } from 'react';

const FeedbackRefreshContext = createContext<{
    triggerRefresh: () => void;
    lastRefreshTime: number;
}>({
    triggerRefresh: () => {},
    lastRefreshTime: 0,
});

export const FeedbackRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

    const triggerRefresh = () => setLastRefreshTime(Date.now());

    return (
        <FeedbackRefreshContext.Provider value={{ triggerRefresh, lastRefreshTime }}>
            {children}
        </FeedbackRefreshContext.Provider>
    );
};

export const useFeedbackRefresh = () => useContext(FeedbackRefreshContext);

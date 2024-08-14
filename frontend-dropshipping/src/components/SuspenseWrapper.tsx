import React, { Suspense } from 'react';

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Suspense fallback={<p>Carregando...</p>}>{children}</Suspense>;
};

export default SuspenseWrapper;

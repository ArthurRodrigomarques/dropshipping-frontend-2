'use client';

import SuspenseWrapper from '@/components/SuspenseWrapper';
import SearchResults from '@/components/SearchResults';

const SearchPage = () => {
    return (
        <SuspenseWrapper>
            <SearchResults />
        </SuspenseWrapper>
    );
};

export default SearchPage;

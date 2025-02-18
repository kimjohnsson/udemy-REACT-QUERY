import InfiniteScroll from 'react-infinite-scroller';
import { Person } from './Person';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: ['sw-people'],
      queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      getNextPageParam: (lastPage) => lastPage.next || undefined
    });

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError) {
    return <div className="error">Error! {error.toString()}</div>;
  }

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        hasMore={hasNextPage}
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
      >
        {data.pages.map((pageData) =>
          pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              eyeColor={person.eye_color}
              hairColor={person.hair_color}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}

# [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)

- `Static Site Generation`은 SSG(Static Site Generation) 시 호출되는 함수입니다.
- 즉, 빌드 시점에 호출되는 함수입니다.

### 언제 `getStaticProps`을 사용해야 하나요?

- 빌드 시점에 사용 가능한 데이터
- SEO에 활용될 데이터
- 페이지의 응답 속도가 중요할 때
  - `getStaticProps`은 HTML과 JSON 파일을 생성한다. (pre-computed at build time)
  - JSON을 빌드 시점에 만들므로, 캐싱에 유리함(별도의 API 요청이 필요 없음) => ISR을 통해 백그라운드에서 갱신을 시킬 수 있음(JSON 다시 생성)
    ```tsx
    // .next/pages/Foo.json
    {"pageProps":{"posts":[{"id":0,"content":"python"},{"id":1,"content":"javascript"},{"id":2,"content":"C++"}]},"__N_SSG":true}
    ```

### 언제 `getStaticProps`이 싫행되나요?

- before inital render
  - `fallback: blocking`
- always
  - `next build`
- background
  - `fallback: true`
  - `revalidate`
- on-demand
  - `revalidate()`

### 어디에서 `getStaticPRops`를 사용할 수 있나요?

- only `./page` 하위 폴더
  - `_app`, `_document`, `_error`에서 사용 불가!

### Example

```tsx
// posts will be populated at build time by getStaticProps()
function Blog({posts}) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  };
}

export default Blog;
```

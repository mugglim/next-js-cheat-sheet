# [Pages](https://nextjs.org/docs/basic-features/pages)

## Static routes vs Dynamic routes

|      |    Static Routes    | Dynamic Routes           |
| :--: | :-----------------: | :----------------------- |
| Path | pages/post/index.js | pages/post/[id].js       |
| URL  |        /post        | /post/1, /post/2, ...etc |

## Pre-rendering

- Next.js는 `pre-render` 기능을 기본적으로 제공합니다.
  - Next.js는 각 페이지의 HTML 코드를 미리 생성합니다.
  - pre-render 통해 SEO와 성능을 높일 수 있습니다.
- HTML 코드는 JavaScript를 통해 인터랙션을 만들 수 있습니다.
  - pre-render 된 HTML 코드와 JavaScript를 연결 짓는 과정을 `hydration`이라고 합니다.
    (아마, Element에 이벤트 헨들러 부착하는 과정이라고 생각)

### Pre-rendering의 2가지 형태

- Next.js는 Pre-rendering을 2가지의 형태로 제공합니다.
  - Static Generation(권장) : 빌드 시점에 HTML 코드 생성 (with `next build`)
    - Next.js는 캐싱, 성능을 위해 Static Generation을 권장한다.
  - Server-side Rendering : 페이지 요청 시 HTML 코드 생성
- 추가로, 데이터 패칭을 위해 Client-side rendering을 Static Generation 또는 Server-side Rendering과 함꼐 사용할 수 있다.

### Static Generation without data

```tsx
const About = () => {
  return <div>About</div>;
};

export default About;
```

### Static Generation with data

- Static Generation 과정에서 데이터 페칭을 하는 방법은 2가지이다.
  - `getStaticProps()` : 정적 라우팅 페이지가 빌드 과정에서 외부 데이터를 패칭
  - `getStaticPaths()` : 동적 라우팅 페이지 중 일부 페이지를 선택하여 빌드 과정에서 외부 데이터를 패칭

`getStaticProps()`

```tsx
// post/index.tsx
import {InferGetStaticPropsType} from 'next';

// server data
const POSTS = [
  {id: 0, content: 'python'},
  {id: 1, content: 'javascript'},
  {id: 2, content: 'C++'},
];

export const getStaticProps = async () => {
  const posts = POSTS;

  return {props: {posts}};
};

const Blog = ({posts}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      {posts.map(({id, content}) => (
        <h2 key={id}>
          id: {id} , content: {content}
        </h2>
      ))}
    </div>
  );
};

export default Blog;
```

`getStaticPaths()`

```tsx
// posts/[postID].tsx

import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import {ParsedUrlQuery} from 'querystring';

interface Post {
  id: number;
  content: string;
}

interface PostProps {
  post: Post;
}

interface Params extends ParsedUrlQuery {
  postID: string;
}

const POSTS = [
  {id: 0, content: 'python'},
  {id: 1, content: 'javascript'},
  {id: 2, content: 'C++'},
];

const Post = ({post}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <h2>
      id: {post.id} / content: {post.content}
    </h2>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = POSTS;

  const canAccessPaths = posts.map(({id}) => ({
    // postID must be same as [postID].tsx
    params: {postID: id.toString()},
  }));

  return {paths: canAccessPaths, fallback: false};
};

export const getStaticProps: GetStaticProps<PostProps, Params> = async (
  ctx,
) => {
  const {postID} = ctx.params!;
  const post = POSTS[Number(postID)];

  return {props: {post}};
};

export default Post;
```

### Server Side Rendering

> use Server Side Rendering only if absolutely necessary !

`getServerSideProps()`

```tsx
// post/[postID].tsx

import {InferGetServerSidePropsType} from 'next';

const POSTS = [
  {id: 0, content: 'python'},
  {id: 1, content: 'javascript'},
  {id: 2, content: 'C++'},
];

export const getServerSideProps = async () => {
  const posts = POSTS;

  return {props: {posts}};
};

const Blog = ({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      {posts.map(({id, content}) => (
        <h2 key={id}>
          id: {id} , content: {content}
        </h2>
      ))}
    </div>
  );
};

export default Blog;
```

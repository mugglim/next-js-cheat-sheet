# [getStaticPaths](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths)

- 만약 페이지가 동적 라우팅을 사용하는데, 특정 페이지의 props를 빌드 타임에 계산하고 싶다면!(pre-computed props)
- `getStaticProps`을 사용하려면, `getStaticPaths`을 반드시 구현해야 합니다.

**Flow**

- on-build... 🛠
  1. select paths for SSG : getStaticPaths()
  2. pre-compute props : getStaticPaths()

```tsx
// pages/posts/[id].js

// Generates `/posts/1` and `/posts/2`
export async function getStaticPaths() {
  return {
    paths: [{params: {id: '1'}}, {params: {id: '2'}}],
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticPaths(context) {
  return {
    // Passed to the page component as props
    props: {post: {}},
  };
}

export default function Post({post}) {
  // Render post...
}
```

### getStaticProps의 반환값

`getStaticProps의`은 `paths`와 `fallback`을 키값으로 가지는 객체를 반환합니다.

```tsx
export async function getStaticPaths(){
    return {
        paths: ...,   // guess what
        fallback: ... // guess what
    }
}
```

#### [paths](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#paths)

```tsx
type Paths<T> = {
  params: {
    [key in keyof T]: T[key];
  }[];
};
```

- `paths`는 pre-rendering에 포함시킬 페이지를 결정합니다. (pre-computed)
  - pre-rendering에 포함되는 페이지는 빌드 타임에 생성됩니다.
- paths의 값은 1차원 배열이며, 각 요소는 동적 라우팅에 사용되는 params을 key값으로 가져야 합니다.

```tsx
// /post/[id].tsx
export async function getStaticPaths() {
  return {
    paths: [
      {params: {id: 1}},
      {params: {id: 2}},
      {params: {id: 3}},
      // ...
    ],
  };
}

// /post/[postID]/[commentID].tsx
export async function getStaticPaths() {
  return {
    paths: [
      {params: {postID: 1, commentID: 1}},
      {params: {postID: 1, commentID: 2}},
      {params: {postID: 1, commentID: 3}},
      //..,
    ],
  };
}

// TODO: i18n 관련 내용 반영

// TODO: Slug 관련 내용 반영
```

#### [fallback](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-false)

```tsx
type Fallback = false | true | 'blocking';
```

- `fallback : false`
  1. `getStaticPaths`의 paths에 포함되지 않는 경로는 404페이지로 리다이렉팅
- `fallback : true`

  1. `getStaticPaths`의 paths에 포함되지 않는 경로는 우선 `fallback` 화면을 보여줌 (단, 클라이언트-사이드로 접근하면 `fallback: blocking`으로 동작)
  2. `fallback` 화면을 보여주면서, Next.js는 백그라운드에서 getStaticProps을 통해 HTML과 JSON을 생섬함(like build)
  3. JSON 파일의 생성이 끝나면, `fallback` 화면이 종료됨
  4. 이후, Next.js는 해당 경로를 pre-computed 경로로 포함시킴

- `fallback : blocking`

  1. `fallback: true`와 유사하지만, `fallback` 화면을 보여주지 않는 차이점이 있음.

간단한 fallback 예제

```tsx
// post/[id].tsx
// pages/posts/[id].js
import {useRouter} from 'next/router';

function Post({post}) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Render post...
}
```

### 언제 getStaticProps을 사용해야 하나요?

- 동적 라우팅을 사용하는데, 특정 경로 빌드 타임에 생성하고 싶은 경우!

### 언제 getStaticProps이 호출되나요?

- always
  - `next build`
- background
  - `fallback : true`
  - `revalidate`
  - `revalidate()` (on-demand)
- before render
  - `fallback : blocking`

### 주의사항 ❗️

- 클라이언트-사이드는 `getStaticProps`을 호출할 수 없음
- 단지, 빌드/요청 시점에 생성된 HTML, JSON을 사용할 뿐

> This JSON file will be used in client-side routing through next/link or next/router. When you navigate to a page that’s pre-rendered using getStaticProps, Next.js fetches this JSON file (pre-computed at build time) and uses it as the props for the page component. This means that client-side page transitions will not call getStaticProps as only the exported JSON is used.

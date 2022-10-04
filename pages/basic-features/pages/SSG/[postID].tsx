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

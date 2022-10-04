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

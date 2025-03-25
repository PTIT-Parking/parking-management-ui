import PostTable from "@/components/posts/PostTable";
import BackButton from "@/components/Backbutton";
import PostsPagination from "@/components/posts/PostPagination";

const PostPage = () => {
  return (
    <>
      <BackButton text="Go Back" link="/" />
      <PostTable />
      <PostsPagination />
    </>
  );
};

export default PostPage;

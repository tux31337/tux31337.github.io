import { getPostData } from "@/api/posts";
import MarkdownViewer from "@/app/components/MarkdownViewer";

type Props = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params: { slug } }: Props) {
  const post = await getPostData(slug);

  console.log("slug", slug);

  return <MarkdownViewer content={post.content} />;
}

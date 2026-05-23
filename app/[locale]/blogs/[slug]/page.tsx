import { getSingleBlogPost } from "../../../../src/lib/serverActions";
import Image from "next/image";

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { locale, slug } = params;

  const response = await getSingleBlogPost(locale, slug);
  const blog = response?.data;

  if (!blog) return <div>Not Found</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      
     

      <div className="relative w-full h-80 mb-6">
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
 <h1 className="text-xl font-bold mb-6">
        {blog.title}
      </h1>
      <div
        className="prose max-w-none text-base text-gray-400"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

    </div>
  );
}

import React from 'react';
import Container from '../shared/container';

type AboutItem = {
  id: number;
  intro: string;      // HTML string
  content: string;    // HTML string
  image: string;
  updated_at: string;
};

type AboutProps = {
  about_page: AboutItem;
};

const About: React.FC<AboutProps> = ({ about_page }) => {
  if (!about_page) return null;

  return (
    <Container className="my-10 lg:my-20">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Image */}
        <div className="flex-1">
          <img
            src={about_page.image}
            alt="About Image"
            className="w-full h-auto rounded-[20px] object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1">
          {/* Intro */}
          <div
            className="text-lg lg:text-xl font-semibold mb-4"
            dangerouslySetInnerHTML={{ __html: about_page.intro }}
          />

          {/* Main Content */}
          <div
            className="text-sm lg:text-base leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: about_page.content }}
          />
        </div>
      </div>
    </Container>
  );
};

export default About;

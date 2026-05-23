"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";
import queryClient from "@/lib/reactQueryClient";
import { PhotoProvider } from 'react-photo-view';

const Providers = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  
  return (
    
   
    <PhotoProvider>
    <DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DirectionProvider>
     </PhotoProvider>
  );
};

export default Providers;

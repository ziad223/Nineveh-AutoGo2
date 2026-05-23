"use server";

import { cookies } from "next/headers";
import apiServiceCall from "./apiServiceCall";
import { errorsHandling } from "./helper";

export const getSingleCourse = async (lang: string, id: string) => {
  try {
    const data = await apiServiceCall({
      url: `courses/${id}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};
export const getSingleCategory = async (lang: string, id: string) => {
  try {
    const data = await apiServiceCall({
      url: `categories/${id}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

export const getSingleService = async (lang: string, id: string) => {
  try {
    const data = await apiServiceCall({
      url: `services/${id}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

export const getProfile = async (lang: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value; 

    const data = await apiServiceCall({
      url: `getProfile`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};
export const getMyServices = async (lang: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value; 

    const data = await apiServiceCall({
      url: `user/services`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

export const getHomeData = async (lang: string) => {
  try {
    const data = await apiServiceCall({
      url: "home",
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

export const getEventsData = async (lang: string, keyword?: string) => {
  try {
    const data = await apiServiceCall({
      url:"services",
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

export const getSettingsData = async (lang: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await apiServiceCall({
      url: "all-settings",
      headers: {
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};
export const getNotificaionsCount = async (lang: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const data = await apiServiceCall({
      url: "notifications/unread-count",
      headers: {
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};


export const getBlogPosts = async (lang: string, page: number = 1, perPage?: number) => {
  try {
    let url = `blog-posts?page=${page}`;
    if (perPage) {
      url += `&per_page=${perPage}`;
    }
    
    const data = await apiServiceCall({
      url: url,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

export const getSingleBlogPost = async (lang: string, slug: string) => {
  try {
    const data = await apiServiceCall({
      url: `blog-posts/${slug}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};
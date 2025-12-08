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
      url: keyword ? `events_list?keyword=${keyword}` : "events_list",
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

export const getSettingsData = async (lang: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log('tokennnnnnnnnnnn', token)
  try {
    const data = await apiServiceCall({
      url: "settings",
      headers: { "Accept-Language": lang,  Authorization: `Bearer ${token}`, },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
  }
};

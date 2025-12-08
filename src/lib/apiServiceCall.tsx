  import axios from "axios";
  const apiServiceCall = async ({
    url,
    method,
    body,
    headers,
  }: {
    url: string;
    method?: string;
    body?: any;
    headers?: any;
  }) => {
    console.log("api service call run");
    console.log("data we need to see", body);

    try {
      // console.log( "headers:",headers)
      const response = await axios({
        method: method?.toUpperCase() || "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        data: body,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        // Spread any custom config passed to the function
      });
      // console.log("xxxxxxxxxxxxxxx", response?.data, method);
      return response?.data;
    } catch (error) {
      // console.log(error)
      // Handle error (you could add more custom error handling here)
      if (axios.isAxiosError(error)) {
        throw {data:error.response?.data, status: error.response?.status} ;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  export default apiServiceCall;

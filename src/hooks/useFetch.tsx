import axios from "axios";
import { useState, useEffect } from "react";

const useFetch = (url: string) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async() => {
      const result = axios.post(url, {
        name: "Ricardo",
        email: "areafe"
      }, {
        withCredentials: true
      })
      setData(result)
    }
    if (url) {
      fetchData()
    }
  }, [url]);

  return data
};

export default useFetch;
import { useState } from "react";
import { toast } from "sonner";

const useFetch=(cb=>{
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    const fetchData=async(...args)=>{
        setLoading(true);
        setError(null);
        try {
            const response=await cb(...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error)
            toast.error(error.message || "Something went wrong");
        }finally{
            setLoading(false);
        }
    }

    return {data,loading,error,fetchData,setData};
})

export default useFetch; 
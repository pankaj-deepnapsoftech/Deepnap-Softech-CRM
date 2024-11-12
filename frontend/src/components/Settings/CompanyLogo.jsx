import React, { useEffect, useRef, useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import FormData from "form-data";
import { useCookies } from "react-cookie";
import {toast} from 'react-toastify';
import Loader from '../ui/Loading';

const CompanyLogo = () => {
  const imageRef = useRef();
  const [cookies] = useCookies();
  const [reload, setReload] = useState(false);
  const [companyLogo, setCompanyLogo] = useState();
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const editSettingsHandler = async (e) => {
    e.preventDefault();
    
    if(imageRef.current.files.length === 0){
      toast.error('Company logo not selected');
      return;
    }
    
    // Check if the image dimensions are as required
    const MAX_WIDTH = 170;
    const MAX_HEIGHT = 120;
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };
    
    img.onload = () => {
      if(img.width > MAX_WIDTH || img.height > MAX_HEIGHT){
        toast.error(`Logo dimesnsions should be ${MAX_WIDTH}x${MAX_HEIGHT}`);
        return;
      }
    };

    reader.readAsDataURL(imageRef.current.files[0]);

    const formData = new FormData();
    formData.append("file", imageRef.current.files[0]);
    
    const imageUploadResponse = await fetch(
      process.env.REACT_APP_IMAGE_UPLOAD_URL,
      {
        method: "POST",
        body: formData,
      }
    );
    const imageUrl = await imageUploadResponse.json();
    
    if (imageUrl?.error) {
      throw new Error(imageUrl?.error);
    }
    
    const body = {
      company_logo: imageUrl[0]
    };
    
    try {
      setUpdating(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "setting/edit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      setReload((prev) => !prev);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      setUpdating(false);
    }
  };

  
  const getSettingsHandler = async ()=>{
    try {
      setIsLoading(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'setting/get', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setCompanyLogo(data?.company_logo)
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    getSettingsHandler();
  }, [reload])


  return (
    <div>
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
        Company Logo
      </div>
      <h4 className="text-[#939393] text-sm md:text-base font-semibold items-center gap-y-1">
        Update your company logo
      </h4>

      {isLoading && <Loader />}
      {!isLoading && <div className="mt-10">
        {companyLogo && <div className="flex justify-center border"><img className="w-[10rem]" src={companyLogo} alt="company logo"></img></div>}
        <form onSubmit={editSettingsHandler}>
          <FormControl className="grid grid-cols-2 gap-2 my-2">
            <FormLabel fontWeight={600}>Company Logo :</FormLabel>
            <Input ref={imageRef} type="file" accept=".jpg, .png" paddingTop="5px" />
          </FormControl>

          <div className="flex justify-end">
            <Button
              isLoading={updating}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Add
            </Button>
          </div>
        </form>
      </div>}
    </div>
  );
};

export default CompanyLogo;

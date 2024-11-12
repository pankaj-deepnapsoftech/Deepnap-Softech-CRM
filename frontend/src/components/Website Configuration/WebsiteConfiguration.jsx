import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../ui/Loading";
import fb_logo from '../../assets/images/fb-logo.png';
import indiamart_logo from '../../assets/images/indiamart-logo.png';

const WebsiteConfiguration = () => {
  const { allowedroutes, role } = useSelector((state) => state.auth);
  const [indiamartApi, setIndiamartApi] = useState();
  const [facebookApi, setFacebookApi] = useState();
  const [cookies] = useCookies();
  const baseUrl = process.env.REACT_APP_BACKEND_URL + "website-configuration/";
  const [indiamartApiLoading, setIndiamartApiLoading] = useState(false);
  const [facebookApiLoading, setFacebookApiLoading] = useState(false);

  const fetchIndiamartApiHandler = async () => {
    try {
      setIndiamartApiLoading(true);
      const response = await fetch(baseUrl + "indiamart-api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setIndiamartApi(data.indiamartApi);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIndiamartApiLoading(false);
    }
  };

  const fetchFacebookApiHandler = async () => {
    try {
      setFacebookApiLoading(true);
      const response = await fetch(baseUrl + "facebook-api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setFacebookApi(data.facebookApi);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFacebookApiLoading(false);
    }
  };

  const updateIndiamartApiHandler = async (e) => {
    e.preventDefault();
    if (!indiamartApi) {
      return;
    }

    try {
      setIndiamartApiLoading(true);
      const response = await fetch(baseUrl + "indiamart-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          indiamartApi: indiamartApi,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIndiamartApiLoading(false);
    }
  };

  const updateFacebookApiHandler = async (e) => {
    e.preventDefault();
    if (!facebookApi) {
      return;
    }

    try {
      setFacebookApiLoading(true);
      const response = await fetch(baseUrl + "facebook-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          facebookApi: facebookApi,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFacebookApiLoading(false);
    }
  };

  useEffect(() => {
    fetchIndiamartApiHandler();
    fetchFacebookApiHandler();
  }, []);

  return (
    <>
      {(role !== 'Super Admin' && !allowedroutes.includes("website-configuration")) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f]">
          You do not have access to this route. Contact your Super Admin for
          further action.
        </div>
      )}

      {(role === 'Super Admin' || allowedroutes.includes("website-configuration")) && (
        <div
          className="border-[1px] px-2 py-8 md:px-9 rounded"
          style={{ boxShadow: "0 0 20px 3px #96beee26" }}
        >
          <div className="text-lg md:text-xl font-semibold items-center gap-y-1">
            {/* <span className="mr-2">
              <MdArrowBack />
            </span> */}
            CRM Configuration
          </div>

          <div className="mt-5">
          <div className="flex gap-2 text-base md:text-lg font-semibold items-center gap-y-1">
              <img className='w-[40px]' src={indiamart_logo}></img><span>Indiamart API</span>
            </div>

            <div className="mt-3">
              {indiamartApiLoading && (
                <div>
                  <Loading />
                </div>
              )}
              {!indiamartApiLoading && (
                <form onSubmit={updateIndiamartApiHandler}>
                  <FormControl>
                    <FormLabel>Indiamart API</FormLabel>
                    <Input
                      value={indiamartApi}
                      onChange={(e) => setIndiamartApi(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="mt-1"
                      paddingX="30px"
                      color="white"
                      backgroundColor="#1640d6"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex gap-2 text-base md:text-lg font-semibold items-center gap-y-1">
              <img className='w-[40px]' src={fb_logo}></img><span>Facebook API</span>
            </div>

            <div className="mt-3">
              {facebookApiLoading && (
                <div>
                  <Loading />
                </div>
              )}
              {!facebookApiLoading && (
                <form onSubmit={updateFacebookApiHandler}>
                  <FormControl>
                    <FormLabel>Facebook API</FormLabel>
                    <Input
                      value={facebookApi}
                      onChange={(e) => setFacebookApi(e.target.value)}
                      type="text"
                    ></Input>
                  </FormControl>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="mt-1"
                      paddingX="30px"
                      color="white"
                      backgroundColor="#1640d6"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WebsiteConfiguration;

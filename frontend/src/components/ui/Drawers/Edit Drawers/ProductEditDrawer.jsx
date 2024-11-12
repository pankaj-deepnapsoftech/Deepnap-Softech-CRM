import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddProductsCategoryDrawer } from "../../../../redux/reducers/misc";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const ProductsEditDrawer = ({
  dataId: id,
  closeDrawerHandler,
  fetchAllProducts,
}) => {
  const [updating, setUpdating] = useState(false);
  const [cookies] = useCookies();
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState();
  // const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ref, setRef] = useState("");
  const [stock, setStock] = useState();
  const file = useRef();

  const navigate = useNavigate();

  const editProductHandler = async (e) => {
    e.preventDefault();

    if (name === "") {
      toast.error("Name should not be empty");
      return;
    }
    if (!category?.value) {
      toast.error("Category not selected");
      return;
    }
    if (price === "") {
      toast.error("Price should not be empty");
      return;
    }

    try {
      setUpdating(true);
      let imageUrl = [];
      if (file.current.files.length !== 0) {
        const formData = new FormData();
        formData.append("file", file.current.files[0]);

        const imageUploadResponse = await fetch(
          process.env.REACT_APP_IMAGE_UPLOAD_URL,
          {
            method: "POST",
            body: formData,
          }
        );
        imageUrl = await imageUploadResponse.json();

        if (imageUrl?.error) {
          throw new Error(imageUrl?.error);
        }
      }
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "product/edit-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          productId: id,
          name,
          categoryId: category?.value,
          price,
          description,
          ref,
          imageUrl: imageUrl.length === 0 ? undefined : imageUrl[0],
          model,
          stock,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllProducts();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally{
      setUpdating(false);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "product/product-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setName(data.product?.name);
      setModel(data.product?.model);
      setPrice(data.product?.price);
      setStock(data.product?.stock);
      setDescription(data.product?.description);
      setCategory({
        value: data.product?.category._id,
        label: data.product?.category.categoryname,
      });
      setRef(data.product?.ref);

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // const getAllColors = async (req, res) => {
  //   try {
  //     const baseURL = process.env.REACT_APP_BACKEND_URL;

  //     const response = await fetch(baseURL + "category/all-colors", {
  //       headers: {
  //         authorization: `Bearer ${cookies?.access_token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       throw new Error(data.message);
  //     }
  //     setColors(data.colors);
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  const getAllProductCategories = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "category/all-categories", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setCategories(data.categories);
    } catch (err) {
      toast(err.message);
    }
  };

  useEffect(() => {
    // getAllColors();
    fetchProductDetails(id);
    getAllProductCategories();
  }, []);

  useEffect(() => {
    let options = [{ value: "Add Category", label: "+ Add Category" }];
    options = options.concat(
      categories.map((data) => {
        return { value: data._id, label: data.categoryname };
      })
    );
    setCategoryOptions(options);
  }, [categories]);

  return (
    <div
      className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Product
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Edit Product
        </h2>

        {isLoading && <Loading />}

        {!isLoading && (
          <form onSubmit={editProductHandler}>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Product Image</FormLabel>
              <Input
                padding={"6px 14px"}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                ref={file}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Model</FormLabel>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                type="text"
                placeholder="Model"
              />
            </FormControl>
            <div className="mt-2 mb-5">
              <label className="font-bold">Category</label>
              <Select
                className="rounded mt-2"
                options={categoryOptions}
                placeholder="Select category"
                value={category}
                onChange={(d) => {
                  if (d.value === "Add Category") {
                    closeDrawerHandler();
                    navigate("/crm/products-category");
                  }
                  setCategory(d);
                }}
                isSearchable={true}
              />
            </div>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Price</FormLabel>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Price"
              />
            </FormControl>
            <FormControl className="mt-2 mb-5">
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                resize="none"
              />
            </FormControl>
            <FormControl className="mt-2 mb-5" isRequired>
              <FormLabel fontWeight="bold">Stock</FormLabel>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                resize="none"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Ref</FormLabel>
              <Input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                type="text"
                placeholder="Ref"
              />
            </FormControl>
            <Button
              isLoading={updating}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductsEditDrawer;

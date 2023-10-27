import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import CustomDataGridServices from "../../components/customDataGridServices";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import axios from "axios";

const CombinedCategoryInput = ({ categories, selectedService, onCategoryChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setSelectedCategory(selectedService?.category || '');
  }, [selectedService]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleServiceSelection = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2 pr-8"
        placeholder="Select or add a category"
        value={selectedCategory}
        onChange={handleCategoryChange}
      />
      <div className="absolute bottom-6 right-3 flex items-center cursor-pointer">
        <div
          onClick={handleDropdownClick}
          className={`h-5 w-5 text-gray-400 ${showDropdown ? 'transform -rotate-90' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  category === selectedCategory ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleServiceSelection(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ServicesPanel = ({ services }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState({});
  const [serviceId, setServiceId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [image, setImage] = useState([]);
  const [url, setUrl] = useState([]);
  const [newPackages, setNewPackages] = useState([]);
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [selectedServiceForUpdate, setSelectedServiceForUpdate] =
    useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");
  const [initialLoading, setInitialLoading] = useState(true);
  let uniqueCategories = [
    ...new Set(services.map((service) => service.category)),
  ];

  useEffect(() => {
    if (services && services.length > 0) {
      setInitialLoading(false);
    }
  }, [services]);

  useEffect(() => {
    setServiceId(selectedServiceForUpdate?.id || "");
    setTitle(selectedServiceForUpdate?.serviceName || "");
    setDescription(selectedServiceForUpdate?.description || "");
    setNewPackages(selectedServiceForUpdate?.packages || []);
    setImage(selectedServiceForUpdate?.image || []);
    setUrl(selectedServiceForUpdate?.url || []);
    setThumbnail(selectedServiceForUpdate?.thumbnail || null);
    setCategory(selectedServiceForUpdate?.category || "");
  }, [selectedServiceForUpdate]);

  const [rows, setRows] = useState(
    services.map((service) => ({
      id: service._id,
      serviceName: service.title,
      description: service.description,
      packages: service.packages,
      thumbnail: service.thumbnail,
      image: service.images,
      url: service.url,
      category: service.category,
    }))
  );

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`
      );
      setRows(
        response.data.map((service) => ({
          id: service._id,
          serviceName: service.title,
          description: service.description,
          packages: service.packages,
          thumbnail: service.thumbnail,
          image: service.images,
          url: service.url,
          category: service.category,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setUrl([]);
    setNewPackages([]);
    setCategory("");
  };

  const handleAddFormOpen = (e) => {
    e.preventDefault();
    resetForm();
    setIsUpdate(false);
    setButtonLabel("Submit");
    setAddNewForm(true);
  };

  const handleAddFormClose = (e) => {
    if (isUpdate) {
      setSelectedServiceForUpdate(null);
    }
    e.preventDefault();
    setAddNewForm(false);
    resetForm();
  };

  const handleFormSubmit = async (e) => {
    setAddNewForm(false);
    e.preventDefault();
    resetForm();

    if (newPackages.length === 0) {
      alert("Please add at least one package");
      return;
    }

    const isAnyPackageFieldEmpty = newPackages.some((pkg) =>
      Object.values(pkg).some(
        (value) => typeof value === "string" && value.trim() === ""
      )
    );

    if (isAnyPackageFieldEmpty) {
      alert("Please fill all the package fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("thumbnail", thumbnail);
    formData.append("description", description);
    image.forEach((img, index) => {
      formData.append(`images`, img);
    });

    const updatedNewPackages = newPackages;

    formData.append("newPackages", JSON.stringify(updatedNewPackages));

    const updatedUrl = url;
    formData.append("url", JSON.stringify(updatedUrl));
    formData.append("category", category);

    try {
      let response;
      if (isUpdate) {
        setShowPrompt(true);
        setPromptMessage({
          message: "Updating Service...",
          styling: "bg-blue-300 text-blue-700",
        });
        setSelectedServiceForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}services/updateServiceById/${selectedServiceForUpdate.id}`,
          formData
        );
        setPromptMessage({
          message: response.data.message,
          styling: "bg-green-300 text-green-700",
        });
      } else {
        setShowPrompt(true);
        setPromptMessage({
          message: "Adding Service...",
          styling: "bg-blue-300 text-blue-700",
        });
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}services/addNewServiceWithImages`,
          formData
        );
        setPromptMessage({
          message: response.data.message,
          styling: "bg-green-300 text-green-700",
        });
      }
      fetchServices();
      setTimeout(() => {
        setShowPrompt(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveImage = (e, index) => {
    e.preventDefault();
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleAddPackage = (e) => {
    e.preventDefault();

    if (newPackages.length < 3) {
      const newCreatedPackage = {
        name: "",
        price: "",
        description: "",
        features: [],
      };
      setNewPackages([...newPackages, newCreatedPackage]);
    }
  };

  const handleRemovePackage = (index) => {
    const updatedPackages = [...newPackages];
    updatedPackages.splice(index, 1);
    setNewPackages(updatedPackages);
  };

  const handleNewPackageChange = (index, key, value) => {
    const updatedPackage = { ...newPackages[index], [key]: value };
    const updatedPackages = [...newPackages];
    updatedPackages[index] = updatedPackage;
    setNewPackages(updatedPackages);
  };

  const deleteService = async (serviceId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}services/deleteService/${serviceId}`
      );
      setRows(rows.filter((row) => row.id !== serviceId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      renderCell: (params) => {
        const onClickEdit = () => {
          setIsUpdate(true);
          setButtonLabel("Update");
          setAddNewForm(true);
          setSelectedServiceForUpdate(params);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete service ${params.serviceName}?`
            )
          ) {
            deleteService(params.id);
          }
        };
        const onClickView = () => {
          setSelectedService(params);
          setOpenDialog(true);
        };
        return (
          <div className="flex items-center">
            <IconButton onClick={onClickView}>
              <VisibilityRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
            <IconButton onClick={onClickEdit}>
              <EditRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
            <IconButton onClick={onClickDelete}>
              <DeleteRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="font-poppins">
      {showPrompt && (
        <div
          className={`${promptMessage.styling} px-4 py-2 text-center text-[20px] font-bold rounded-md absolute bottom-10 right-10`}
        >
          {promptMessage.message}
        </div>
      )}
      {initialLoading ? (
        <div className="flex justify-center items-center h-screen">
          <ReactLoading type="spin" color="#000" />
        </div>
      ) : (
        <div>
          <div className="mb-2 flex flex-row justify-between items-center">
            <div className="text-3xl">Services</div>
            <button
              className="py-1 px-2 xs:py-2 xs:px-4 button-animation-reverse hover:scale-100 rounded-md"
              onClick={handleAddFormOpen}
            >
              <span className="hidden xs:flex">+ Add New</span>
              <span className="xs:hidden flex">+ Add</span>
            </button>
          </div>
          <div
            style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
            className="h-auto overflow-auto w-full"
          >
            <CustomDataGridServices data={rows} columns={columns} />
          </div>
          <div>
            <Dialog open={addNewForm}>
              <div className="p-4 font-poppins">
                <div className="text-2xl font-bold pb-3">Add New Service</div>
                <form encType="multipart/form-data">
                  <label htmlFor="title" className="font-bold">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                    id="title"
                    placeholder="Enter Service Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label htmlFor="thumbnail" className="font-bold">
                    Thumbnail
                  </label>
                  {thumbnail && (
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          typeof thumbnail === "string"
                            ? thumbnail
                            : URL.createObjectURL(thumbnail)
                        }
                        alt="Current thumbnail"
                        className="w-[auto] h-[150px] p-2 bg-gray-200 rounded-md mb-3"
                      />
                      <button
                        className="bg-red-600 text-white py-1 px-3 rounded"
                        onClick={() => setThumbnail(null)}
                      >
                        X
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="thumbnail"
                    className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                  <label htmlFor="description" className="font-bold">
                    Description
                  </label>
                  <QuillNoSSRWrapper
                    theme="snow"
                    id="description"
                    placeholder="Some Words About This Service"
                    className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                    value={description}
                    onChange={(content, delta, source, editor) =>
                      setDescription(editor.getHTML())
                    }
                  />

                  <CombinedCategoryInput 
                    categories={uniqueCategories}
                    selectedService={selectedServiceForUpdate}
                    onCategoryChange={(value) => setCategory(value)}
                  />
                  <label htmlFor="url" className="font-bold">
                    YouTube URLs
                  </label>
                  <input
                    type="text"
                    className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                    id="url"
                    placeholder="Enter URLs"
                    value={url.join(",")} // Join the array values with commas
                    onChange={(e) =>
                      setUrl(e.target.value.split(",").map((str) => str.trim()))
                    }
                  />
                  <label htmlFor="image" className="font-bold">
                    Image
                  </label>
                  {image &&
                    image.map((file, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <img
                          src={
                            typeof file === "string"
                              ? file
                              : URL.createObjectURL(file)
                          }
                          alt={`Current image ${index + 1}`}
                          className="w-[auto] h-[150px] p-2 bg-gray-200 rounded-md mb-3"
                        />

                        <button
                          className="bg-red-600 text-white py-1 px-3 rounded"
                          onClick={(e) => handleRemoveImage(e, index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  <input
                    type="file"
                    id="image"
                    className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setImage((prev) => [
                        ...(Array.isArray(prev) ? prev : []),
                        ...Array.from(e.target.files),
                      ])
                    }
                  />
                  {newPackages.length > 0 && (
                    <div className="underline text-xl font-bold">Packages</div>
                  )}
                  {newPackages.map((pkg, index) => (
                    <div key={index}>
                      <div className="text-center font-bold mt-4">
                        Package {index + 1}
                      </div>
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor={`pkg-name-${index}`}
                          className="font-bold"
                        >
                          Package Name
                        </label>
                        <div
                          className="text-red-500 flex flex-row cursor-pointer"
                          onClick={() => handleRemovePackage(index)}
                        >
                          <div>Remove</div>
                          <RemoveCircleRoundedIcon />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Package Name"
                        id={`pkg-name-${index}`}
                        className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                        value={pkg.name}
                        onChange={(e) =>
                          handleNewPackageChange(index, "name", e.target.value)
                        }
                      />

                      <label
                        htmlFor={`pkg-price-${index}`}
                        className="font-bold"
                      >
                        Package Price
                      </label>
                      <input
                        type="text"
                        placeholder="Price Of This Package"
                        id={`pkg-price-${index}`}
                        className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                        value={pkg.price}
                        onChange={(e) =>
                          handleNewPackageChange(index, "price", e.target.value)
                        }
                      />

                      <label
                        htmlFor={`pkg-description-${index}`}
                        className="font-bold"
                      >
                        Package Description
                      </label>
                      <textarea
                        id={`pkg-description-${index}`}
                        className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                        placeholder="Some Words"
                        value={pkg.description}
                        onChange={(e) =>
                          handleNewPackageChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      ></textarea>

                      <label
                        htmlFor={`pkg-features-${index}`}
                        className="font-bold"
                      >
                        Features
                      </label>
                      <input
                        type="text"
                        id={`pkg-features-${index}`}
                        value={pkg.features}
                        className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                        placeholder="Comma Separated Feature List"
                        onChange={(e) => {
                          handleNewPackageChange(
                            index,
                            "features",
                            e.target.value.split(",")
                          );
                        }}
                      />
                    </div>
                  ))}
                </form>
              </div>
              <DialogActions>
                {newPackages.length < 3 && (
                  <button
                    onClick={handleAddPackage}
                    className="py-2 px-4 rounded-md button-animation-reverse-orange-soft hover:text-black hover:scale-100 font-poppins"
                  >
                    + Add Package
                  </button>
                )}
                <button
                  className="py-2 px-4 rounded-md button-animation-reverse-green-soft hover:text-black hover:scale-100 font-poppins"
                  onClick={handleFormSubmit}
                >
                  {buttonLabel}
                </button>
                <button
                  className="py-2 px-4 rounded-md button-animation-reverse-red-soft hover:text-black hover:scale-100 font-poppins"
                  onClick={handleAddFormClose}
                >
                  Close
                </button>
              </DialogActions>
            </Dialog>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              {selectedService && (
                <div className="font-poppins rounded-3xl w-[250px] h-[500px] md:w-[550px] md:h-[300px] lg:w-[600px] lg:h-[500px] flex flex-col">
                  <div className="flex justify-between items-center flex-col">
                    <div className="text-3xl font-bold my-2 ">
                      {selectedService.serviceName}
                    </div>
                    <hr className="border-2 border-gray-300 w-[250px] rounded-xl" />
                  </div>
                  <DialogContent>
                    <div>
                      <div className="underline text-xl">Description:</div>
                      <p
                        className="my-1"
                        dangerouslySetInnerHTML={{
                          __html: selectedService.description,
                        }}
                      />
                      <hr className="border-2 border-gray-300 rounded-xl" />
                    </div>
                    <div>
                      <div className="underline text-xl mt-3">Packages:</div>
                      <div className="md:flex md:flex-row justify-around">
                        {selectedService.packages.map((pack) => (
                          <div key={pack._id} className="my-5">
                            <div className="text-lg font-bold">{pack.name}</div>
                            <div>{pack.description}</div>
                            <ul className="list-disc">
                              {pack.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="underline text-xl mt-3">Category:</div>
                      <div>{selectedService.category}</div>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <button
                      className="py-2 px-4 rounded-md bg-blue-400"
                      onClick={() => setOpenDialog(false)}
                    >
                      Close
                    </button>
                  </DialogActions>
                </div>
              )}
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPanel;

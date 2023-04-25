import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import axios from "axios";

export default function AdminServices({ services }) {
  const [serviceId, setServiceId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [newPackages, setNewPackages] = useState([]);
  const [selectedServiceForUpdate, setSelectedServiceForUpdate] =
    useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");

  useEffect(() => {
    setServiceId(selectedServiceForUpdate?.id || "");
    setTitle(selectedServiceForUpdate?.serviceName || "");
    setDescription(selectedServiceForUpdate?.description || "");
    setNewPackages(selectedServiceForUpdate?.packages || []);
  }, [selectedServiceForUpdate]);

  const [rows, setRows] = useState(
    services.map((service) => ({
      id: service._id,
      serviceName: service.title,
      description: service.description,
      numberOfPackages: service.packages.length,
      packages: service.packages,
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
          numberOfPackages: service.packages.length,
          packages: service.packages,
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
    setNewPackages([]);
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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    const updatedNewPackages = newPackages;
    formData.append("newPackages", JSON.stringify(updatedNewPackages));

    try {
      let response;
      if (isUpdate) {
        setSelectedServiceForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}services/updateServiceById/${selectedServiceForUpdate.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}services/addNewService`,
          formData
        );
      }
      fetchServices();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddPackage = (e) => {
    e.preventDefault();
    const newCreatedPackage = {
      name: "",
      price: "",
      description: "",
      features: [],
    };
    setNewPackages([...newPackages, newCreatedPackage]);
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
      valueGetter: (params) => params.row.serviceName,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      valueGetter: (params) => params.row.description,
    },
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const onClickEdit = () => {
          setIsUpdate(true);
          setButtonLabel("Update");
          setAddNewForm(true);
          setSelectedServiceForUpdate(params.row);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete service ${params.row.serviceName}?`
            )
          ) {
            deleteService(params.row.id);
          }
        };
        const onClickView = () => {
          console.log(params.row);
          setSelectedService(params.row);
          setOpenDialog(true);
        };
        return (
          <>
            <IconButton onClick={onClickView}>
              <ViewAgendaRoundedIcon />
            </IconButton>
            <IconButton onClick={onClickEdit}>
              <EditRoundedIcon />
            </IconButton>
            <IconButton onClick={onClickDelete}>
              <DeleteRoundedIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="md:mt-10 mt-24 mb-2 flex flex-row justify-between">
        <div className="text-3xl">Services</div>
        <button
          className="py-2 px-4 bg-orange-400 rounded-md"
          onClick={handleAddFormOpen}
        >
          + Add New Service
        </button>
      </div>
      <div
        style={{ height: 450, overflowX: "auto", maxWidth: "100%" }}
        className="h-auto w-full bg-white shadow-lg "
      >
        <DataGrid rows={rows} columns={columns} />
      </div>
      <div>
        <Dialog open={addNewForm} onClose={handleAddFormClose}>
          <div className="p-4">
            <div className="text-2xl font-bold pb-3">Add New Service</div>
            <form>
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

              <label htmlFor="description" className="font-bold">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Some Words About This Service"
                className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <label htmlFor="image" className="font-bold">
                Image
              </label>
              <input
                type="file"
                id="image"
                className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {newPackages.length > 0 && (
                <div className="text-center underline text-xl font-bold">
                  Packages
                </div>
              )}
              {newPackages.map((pkg, index) => (
                <div key={index}>
                  <div className="flex flex-row justify-between">
                    <label htmlFor={`pkg-name-${index}`} className="font-bold">
                      Package Name
                    </label>
                    <div
                      className="text-red-500 flex flex-row cursor-pointer"
                      onClick={handleRemovePackage}
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

                  <label htmlFor={`pkg-price-${index}`} className="font-bold">
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
            <button
              onClick={handleAddPackage}
              className="py-2 px-4 rounded-md bg-orange-400"
            >
              + Add Package
            </button>
            <button
              className="py-2 px-4 rounded-md bg-green-400"
              onClick={handleFormSubmit}
            >
              {buttonLabel}
            </button>
            <button
              className="py-2 px-4 rounded-md bg-red-400"
              onClick={handleAddFormClose}
            >
              Close
            </button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          {selectedService && (
            <div className=" rounded-3xl w-[250px] h-[500px] md:w-[550px] md:h-[300px] lg:w-[600px] lg:h-[500px] flex flex-col">
              <div className="flex justify-between items-center flex-col">
                <div className="text-3xl font-bold my-2 ">
                  {selectedService.serviceName}
                </div>
                <hr className="border-2 border-gray-300 w-[250px] rounded-xl" />
              </div>
              <DialogContent>
                <div>
                  <div className="underline text-xl">Description:</div>
                  <div className="my-1">{selectedService.description}</div>
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
    </>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`);
  const services = res.data;
  return {
    props: {
      services,
    },
  };
}

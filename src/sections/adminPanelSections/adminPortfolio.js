import CustomDataGrid from "../../components/customDataGrid";
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

const PortfolioPanel = ({ portfolios }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState({});
  const [portfolioId, setPortfolioId] = useState("");
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState([]);
  const [isSpecial, setIsSpecial] = useState(false);
  const [selectedPortfolioForUpdate, setSelectedPortfolioForUpdate] =
    useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (portfolios && portfolios.length > 0) {
      setInitialLoading(false);
    }
  }, [portfolios]);

  useEffect(() => {
    setPortfolioId(selectedPortfolioForUpdate?.id || "");
    setTitle(selectedPortfolioForUpdate?.portfolioName || "");
    setUrl(selectedPortfolioForUpdate?.url || []);
    setClientName(selectedPortfolioForUpdate?.clientName || "");
    setDescription(selectedPortfolioForUpdate?.description || "");
    setStars(selectedPortfolioForUpdate?.stars || 0);
    setImages(selectedPortfolioForUpdate?.images || []);
    setIsSpecial(selectedPortfolioForUpdate?.isSpecial || false);
  }, [selectedPortfolioForUpdate]);

  const [rows, setRows] = useState(
    portfolios.map((portfolio) => ({
      id: portfolio._id,
      portfolioName: portfolio.title,
      url: portfolio.url,
      clientName: portfolio.clientName,
      description: portfolio.description,
      stars: portfolio.stars,
      images: portfolio.images,
      isSpecial: portfolio.isSpecial,
    }))
  );

  const fetchPortfolios = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getAllPortfolio`
      );
      setRows(
        response.data.map((portfolio) => ({
          id: portfolio._id,
          portfolioName: portfolio.title,
          url: portfolio.url,
          clientName: portfolio.clientName,
          description: portfolio.description,
          stars: portfolio.stars,
          images: portfolio.images,
          isSpecial: portfolio.isSpecial,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setUrl([]);
    setClientName("");
    setDescription("");
    setStars(0);
    setImages(null);
    setIsSpecial(false);
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
      setSelectedPortfolioForUpdate(null);
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
    formData.append("clientName", clientName);
    formData.append("description", description);
    formData.append("stars", stars);
    formData.append("isSpecial", isSpecial);

    images.forEach((image) => {
      formData.append("images", image);
    });
    
    const updatedUrls = url;
    formData.append("url", JSON.stringify(updatedUrls));

    try {
      let response;
      if (isUpdate) {
        setShowPrompt(true);
        setPromptMessage({
          message: "Updating Service...",
          styling: "bg-blue-300 text-blue-700",
        });
        setSelectedPortfolioForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/updatePortfolioById/${selectedPortfolioForUpdate.id}`,
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
          `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/addNewPortfolio`,
          formData
        );
        setPromptMessage({
          message: response.data.message,
          styling: "bg-green-300 text-green-700",
        });
      }
      fetchPortfolios();
      setTimeout(() => {
        setShowPrompt(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveImage = (e, index) => {
    e.preventDefault();
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const deletePortfolio = async (portfolioId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/deletePortfolio/${portfolioId}`
      );
      setRows(rows.filter((row) => row.id !== portfolioId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "portfolioName",
      headerName: "Title",
    },
    {
      field: "clientName",
      headerName: "Client",
    },
    {
      field: "description",
      headerName: "Description",
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const onClickEdit = () => {
          setIsUpdate(true);
          setButtonLabel("Update");
          setAddNewForm(true);
          setSelectedPortfolioForUpdate(params);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete portfolio ${params.portfolioName}?`
            )
          ) {
            deletePortfolio(params.id);
          }
        };
        return (
          <>
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
    <div className="font-poppins">
      {initialLoading ? (
        <div className="flex justify-center items-center h-screen">
          <ReactLoading type="spin" color="#000" />
        </div>
      ) : (
        <div>
          <div className="mb-2 flex flex-row justify-between">
            <div className="text-3xl">Portfolio</div>
            <button
              className="py-2 px-4 bg-orange-400 rounded-md"
              onClick={handleAddFormOpen}
            >
              + Add New
            </button>
          </div>
          <div
            style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
            className="h-auto overflow-auto w-full"
          >
            <CustomDataGrid data={rows} columns={columns} autoHeight />
          </div>
          <div>
            <Dialog open={addNewForm} onClose={handleAddFormClose}>
              <div className="p-4 font-poppins">
                <div className="text-2xl font-bold pb-3">Add New Portfolio</div>
                <form encType="multipart/form-data">
                  <label htmlFor="title" className="font-bold">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                    id="title"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <label htmlFor="clientName" className="font-bold">
                    Client Name
                  </label>
                  <input
                    type="text"
                    className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                    id="clientName"
                    placeholder="Enter Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />

                  <label htmlFor="description" className="font-bold">
                    Description
                  </label>
                  <textarea
                    className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                    id="description"
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <label htmlFor="stars" className="font-bold">
                    Stars
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                    id="stars"
                    placeholder="Enter Stars"
                    value={stars}
                    onChange={(e) => setStars(e.target.value)}
                  />

                  <label htmlFor="image" className="font-bold">
                    Images
                  </label>
                  {images &&
                    images.map((file, index) => (
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
                      setImages((prev) => [
                        ...(Array.isArray(prev) ? prev : []),
                        ...Array.from(e.target.files),
                      ])
                    }
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
                  <input
                    type="checkbox"
                    className="border-[2px] border-gray-300 rounded-md"
                    id="isSpecial"
                    value={isSpecial}
                    checked={isSpecial}
                    onChange={(e) => setIsSpecial(e.target.checked)}
                  />
                  <label htmlFor="isSpecial" className="font-bold px-2">
                    ShowCase
                  </label>
                </form>
              </div>
              <DialogActions>
                <button
                  className="py-2 px-4 rounded-md bg-green-400 font-poppins"
                  onClick={handleFormSubmit}
                >
                  {buttonLabel}
                </button>
                <button
                  className="py-2 px-4 rounded-md bg-red-400 font-poppins"
                  onClick={handleAddFormClose}
                >
                  Close
                </button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPanel;

import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

export default function AdminPortfolio({ portfolios }) {
  const [portfolioId, setPortfolioId] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isSpecial, setIsSpecial] = useState(false);
  const [selectedPortfolioForUpdate, setSelectedPortfolioForUpdate] =
    useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");

  useEffect(() => {
    setPortfolioId(selectedPortfolioForUpdate?.id || "");
    setTitle(selectedPortfolioForUpdate?.portfolioName || "");
    setUrl(selectedPortfolioForUpdate?.url || "");
    setIsSpecial(selectedPortfolioForUpdate?.isSpecial || false);
  }, [selectedPortfolioForUpdate]);

  const [rows, setRows] = useState(
    portfolios.map((portfolio) => ({
      id: portfolio._id,
      portfolioName: portfolio.title,
      url: portfolio.url,
      isSpecial: portfolio.isSpecial,
    }))
  );

  const fetchPortfolios = async () => {
    try {
      const response = await axios.get(
        "https://enigmatic-badlands-35417.herokuapp.com/portfolio/getAllPortfolio"
      );
      setRows(
        response.data.map((portfolio) => ({
          id: portfolio._id,
          portfolioName: portfolio.title,
          url: portfolio.url,
          isSpecial: portfolio.isSpecial,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };


  
  const resetForm = () => {
    setTitle("");
    setUrl("");
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
    formData.append("url", url);
    formData.append("isSpecial", isSpecial);

    try {
      let response;
      if (isUpdate) {
        setSelectedPortfolioForUpdate(null);
        response = await axios.put(
          `https://enigmatic-badlands-35417.herokuapp.com/portfolio/updatePortfolioById/${selectedPortfolioForUpdate.id}`,
          formData
        );
      } else {
        response = await axios.post(
          "https://enigmatic-badlands-35417.herokuapp.com/portfolio/addNewPortfolio",
          formData
        );
      }
      fetchPortfolios();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePortfolio = async (portfolioId) => {
    try {
      await axios.delete(`https://enigmatic-badlands-35417.herokuapp.com/portfolio/deletePortfolio/${portfolioId}`);
      setRows(rows.filter((row) => row.id !== portfolioId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "portfolioName",
      headerName: "Title",
      flex: 1,
      valueGetter: (params) => params.row.portfolioName,
    },
    {
      field: "url",
      headerName: "Url",
      flex: 1,
      valueGetter: (params) => params.row.url,
    },
    {
        field: "isSpecial",
        headerName: "ShowCase",
        flex: 1,
        valueGetter: (params) => params.row.isSpecial,
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
          setSelectedPortfolioForUpdate(params.row);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete portfolio ${params.row.portfolioName}?`
            )
          ) {
            deletePortfolio(params.row.id);
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
    <>
      <div className="md:mt-10 mt-24 mb-2 flex flex-row justify-between">
        <div className="text-3xl">Portfolio</div>
        <button
          className="py-2 px-4 bg-orange-400 rounded-md"
          onClick={handleAddFormOpen}
        >
          + Add New Portfolio
        </button>
      </div>
      <div
        style={{ maxWidth: '100%'}}
        className="h-auto w-full bg-white shadow-lg "
      >
        <DataGrid rows={rows} columns={columns} autoHeight/>
        </div>
        <div>
        <Dialog open={addNewForm} onClose={handleAddFormClose}>
          <div className="p-4">
            <div className="text-2xl font-bold pb-3">Add New Portfolio</div>
            <form>
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

              <label htmlFor="url" className="font-bold">
                YouTube Url
              </label>
              <input
                type="url"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="url"
                placeholder="Enter Url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
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
      </div>
    </>
  );
}

export async function getServerSideProps() {
    const res = await axios.get("https://enigmatic-badlands-35417.herokuapp.com/portfolio/getAllPortfolio");
    const portfolios = res.data;
    return {
      props: {
        portfolios,
      },
    };
  }
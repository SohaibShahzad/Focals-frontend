import CustomDataGrid from "../../components/customDataGrid";
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

const PortfolioPanel = ({portfolios}) => {
    const [portfolioId, setPortfolioId] = useState("");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
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
          `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getAllPortfolio`
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
            `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/updatePortfolioById/${selectedPortfolioForUpdate.id}`,
            formData
          );
        } else {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/addNewPortfolio`,
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
        flex: 1,
      },
      {
        field: "url",
        headerName: "Url",
        flex: 1,
      },
      {
        field: "isSpecial",
        headerName: "ShowCase",
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
  
}

export default PortfolioPanel;
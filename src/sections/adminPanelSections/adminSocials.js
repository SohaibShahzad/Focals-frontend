import CustomDataGrid from "../../components/customDataGrid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

const SocialLinksPanel = ({ socialLinks }) => {
  const [linkId, setLinkId] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [addNewLinkForm, setAddNewLinkForm] = useState(false);
  const [selectedLinkForUpdate, setSelectedLinkForUpdate] = useState(null);

  useEffect(() => {
    setLinkId(selectedLinkForUpdate?.id || "");
    setLinkName(selectedLinkForUpdate?.linkName || "");
    setLinkURL(selectedLinkForUpdate?.linkURL || "");
  }, [selectedLinkForUpdate]);

  const [rows, setRows] = useState(
    socialLinks.map((link) => ({
      id: link._id,
      linkName: link.linkName,
      linkURL: link.linkURL,
    }))
  );

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}socials/getAllSocialLinks`
      );
      setRows(
        response.data.map((link) => ({
          id: link._id,
          linkName: link.linkName,
          linkURL: link.linkURL,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setLinkName("");
    setLinkURL("");
    setSelectedLinkForUpdate(null);
  };

  const handleAddLinkFormClose = (e) => {
    if (isUpdate) {
      setSelectedLinkForUpdate(null);
    }
    e.preventDefault();
    setAddNewLinkForm(false);
    resetForm();
  };

  const linkColumns = [
    {
      field: "linkName",
      headerName: "Link Name",
    },
    {
      field: "linkURL",
      headerName: "Link URL",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const onClickEdit = () => {
          setSelectedLinkForUpdate(params);
          setAddNewLinkForm(true);
          setIsUpdate(true);
        };
        return (
          <>
            <IconButton onClick={onClickEdit}>
              <EditRoundedIcon className="text-white" />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleLinksFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("linkName", linkName);
    formData.append("linkURL", linkURL);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}socials/updateSocialLinkById/${selectedLinkForUpdate.id}`,
        formData
      );
      if (response.status === 200) {
        fetchSocialLinks();
        setAddNewLinkForm(false);
        resetForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col font-poppins h-screen">
      <div className="mb-2 flex flex-row justify-between">
        <div className="text-3xl">Social Links</div>
      </div>
      <div>
        <div
          style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
          className="h-auto overflow-auto w-full"
        >
          <CustomDataGrid data={rows} columns={linkColumns} autoHeight />
        </div>
        <div>
          <Dialog open={addNewLinkForm} onClose={handleAddLinkFormClose}>
            <div className="p-4 font-poppins">
              <form>
                <div className="text-center text-[24px] font-bold">
                  {linkName}
                </div>
                <label>URL</label>
                <input
                  type="text"
                  id="linkURL"
                  placeholder="Enter URL"
                  className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                  value={linkURL}
                  onChange={(e) => setLinkURL(e.target.value)}
                />
              </form>
              <DialogActions>
                <button
                  className="py-2 px-4 rounded-md bg-green-400 font-poppins"
                  onClick={handleLinksFormSubmit}
                >
                  Update
                </button>
                <button
                  className="py-2 px-4 rounded-md bg-red-400 font-poppins"
                  onClick={handleAddLinkFormClose}
                >
                  Close
                </button>
              </DialogActions>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksPanel;

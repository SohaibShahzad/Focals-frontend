import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import CustomDataGridServices from "../../../components/customDataGridServices";
import axios from "axios";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";

export default function Links({ termPolicy }) {
  const [contentId, setContentId] = useState("");
  const [contentName, setContentName] = useState("");
  const [contentPara, setContentPara] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [addNewContentForm, setAddNewContentForm] = useState(false);
  const [selectedContentForUpdate, setSelectedContentForUpdate] =
    useState(null);

  useEffect(() => {
    setContentId(selectedContentForUpdate?._id || "");
    setContentName(selectedContentForUpdate?.contentName || "");
    setContentPara(selectedContentForUpdate?.contentPara || "");
  }, [selectedContentForUpdate]);

  const [termPolicyRows, setTermPolicyRows] = useState(
    termPolicy.map((data) => ({
      id: data._id,
      contentName: data.contentName,
      contentPara: data.contentPara,
    }))
  );

  const fetchTermPolicy = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}termsPolicy/getAllContent`
      );
      setTermPolicyRows(
        response.data.map((data) => ({
          id: data._id,
          contentName: data.contentName,
          contentPara: data.contentPara,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setContentName("");
    setContentPara("");
    setSelectedContentForUpdate(null);
  };

  const handleAddContentFormClose = (e) => {
    if (isUpdate) {
      setSelectedContentForUpdate(null);
    }
    e.preventDefault();
    setAddNewContentForm(false);

    resetForm();
  };

  const tandpColumns = [
    {
      field: "contentName",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "contentPara",
      headerName: "Content",
      flex: 1,
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const onClickEdit = () => {
          setIsUpdate(true);
          setAddNewContentForm(true);
          setSelectedContentForUpdate(params);
        };
        return (
          <>
            <IconButton onClick={onClickEdit}>
              <EditRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125"/>
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleTandPFormSubmit = async (e) => {
    const formData = new FormData();
    formData.append("contentName", contentName);
    formData.append("contentPara", contentPara);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}termsPolicy/updateContentById/${selectedContentForUpdate.id}`,
        formData
      );
      if (response.status === 200) {
        fetchTermPolicy();
        setAddNewContentForm(false);
        resetForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col font-poppins h-screen">
      <div className="mb-2 flex flex-row justify-between">
        <div className="text-3xl">Terms and Privacy</div>
      </div>
      <div>
        <div
          style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
          className="h-auto overflow-auto w-full"
        >
          <CustomDataGridServices
            data={termPolicyRows}
            columns={tandpColumns}
            autoHeight
          />
        </div>
        <div>
          <Dialog open={addNewContentForm} onClose={handleAddContentFormClose}>
            <div className="p-4 font-poppins">
              <form>
                <div className="text-center text-[24px] font-bold">
                  {contentName}
                </div>
                <label>Content</label>
                <QuillNoSSRWrapper
                  theme="snow"
                  id="content"
                  placeholder="Some Words About This Service"
                  className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                  value={contentPara}
                  onChange={(content, delta, source, editor) =>
                    setContentPara(editor.getHTML())
                  }
                />
              </form>
              <DialogActions>
                <button
                  className="py-2 px-4 rounded-md button-animation-reverse-green-soft hover:text-black hover:scale-100 font-poppins"
                  onClick={handleTandPFormSubmit}
                >
                  Update
                </button>
                <button
                  className="py-2 px-4 rounded-md button-animation-reverse-red-soft hover:text-black hover:scale-100 font-poppins"
                  onClick={handleAddContentFormClose}
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
}

export async function getServerSideProps() {
  const termAndPolicyRes = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}termsPolicy/getAllContent`
  );
  const termPolicy = termAndPolicyRes.data;

  return {
    props: {
      termPolicy,
    },
  };
}

import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import CustomDataGrid from "../../components/customDataGrid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import axios from "axios";

const BlogsPanel = ({ blogs }) => {
    const [blogId, setBlogId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [author, setAuthor] = useState("");
    const [image, setImage] = useState(null);
    const [blogTags, setBlogTags] = useState([]);
    const [isSpecial, setIsSpecial] = useState(false);
    const [selectedBlogForUpdate, setSelectedBlogForUpdate] = useState(null);
    const [addNewForm, setAddNewForm] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Submit");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
  
    useEffect(() => {
      setBlogId(selectedBlogForUpdate?.id || "");
      setTitle(selectedBlogForUpdate?.blogName || "");
      setContent(selectedBlogForUpdate?.content || "");
      setBlogTags(selectedBlogForUpdate?.blogTags || []);
      setAuthor(selectedBlogForUpdate?.author || "");
      setDate(selectedBlogForUpdate?.date || "");
      setImage(selectedBlogForUpdate?.image || null);
      setIsSpecial(selectedBlogForUpdate?.isSpecial || false);
    }, [selectedBlogForUpdate]);
  
    const [rows, setRows] = useState(
      blogs.map((blog) => ({
        id: blog._id,
        blogName: blog.title,
        content: blog.content,
        blogTags: blog.blogTags,
        author: blog.author,
        date: blog.date,
        isSpecial: blog.isSpecial,
        image: blog.image,
      }))
    );
  
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getAllBlogs`
        );
        setRows(
          response.data.map((blog) => ({
            id: blog._id,
            blogName: blog.title,
            content: blog.content,
            blogTags: blog.blogTags,
            author: blog.author,
            date: blog.date,
            isSpecial: blog.isSpecial,
            image: blog.image,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };
  
    const resetForm = () => {
      setTitle("");
      setContent("");
      setImage(null);
      setBlogTags([]);
      setAuthor("");
      setDate("");
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
        setSelectedBlogForUpdate(null);
      }
      e.preventDefault();
      setAddNewForm(false);
      resetForm();
    };
  
    const handleFormSubmit = async (e) => {
  
      if (title === "" || content === "" || author === "" || date === "" || image === null) {
        alert("Please fill all the fields");
        return;
      }
  
      setAddNewForm(false);
      e.preventDefault();
      resetForm();
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image);
      formData.append("author", author);
      formData.append("date", date);
      formData.append("isSpecial", isSpecial);
  
      const updatedNewBlogTags = blogTags;
      formData.append("blogTags", JSON.stringify(updatedNewBlogTags));
  
      try {
        let response;
        if (isUpdate) {
          response = await axios.put(
            `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/updateBlogById/${selectedBlogForUpdate.id}`,
            formData
            );
            setSelectedBlogForUpdate(null);
        } else {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/addNewBlogWithImage`,
            formData
          );
        }
        fetchBlogs();
      } catch (error) {
        console.log(error);
      }
    };
  
    const deleteBlog = async (blogId) => {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/deleteBlog/${blogId}`
        );
        setRows(rows.filter((row) => row.id !== blogId));
      } catch (error) {
        console.log(error);
      }
    };
  
    const columns = [
      {
        field: "blogName",
        headerName: "Blog Title",
        flex: 1,
      },
      {
        field: "author",
        headerName: "Author",
        flex: 1,
      },
      {
        field: "date",
        headerName: "Date",
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
            setSelectedBlogForUpdate(params);
          };
  
          const onClickDelete = () => {
            const blogTitle = params.blogName;
            if (
              window.confirm(`Are you sure you want to delete blog ${blogTitle}?`)
            ) {
              deleteBlog(params.id);
            }
          };
  
          const onClickView = () => {
            console.log(params);
            setSelectedBlog(params);
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
      <div className="font-poppins">
        <div className="mb-2 flex flex-row justify-between">
          <div className="text-3xl">Blogs</div>
          <button
            className="py-2 px-4 bg-orange-400 rounded-md"
            onClick={handleAddFormOpen}
          >
            + Add New Blog
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
              <div className="text-2xl font-bold pb-3">Add New Blog</div>
              <form>
                <label htmlFor="title" className="font-bold">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                  id="title"
                  placeholder="Enter Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
  
                <label htmlFor="content" className="font-bold">
                  Content
                </label>
                <QuillNoSSRWrapper
                  theme="snow"
                  id="content"
                  placeholder="Some Words About This Service"
                  className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                  value={content}
                  onChange={(content, delta, source, editor) =>
                    setContent(editor.getHTML())
                  }
                />
  
                <label htmlFor="author" className="font-bold">
                  Author
                </label>
                <input
                  type="text"
                  className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                  id="author"
                  placeholder="Enter Author Name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
  
                <label htmlFor="date" className="font-bold">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
  
                <label htmlFor="image" className="font-bold">
                  Image
                </label>
                {image && (
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt="Current image"
                      className="w-[auto] h-[150px] p-2 bg-gray-200 rounded-md mb-3"
                    />
                    <button
                      className="bg-red-600 text-white py-1 px-3 rounded"
                      onClick={() => setImage(null)}
                    >
                      X
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
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
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            {selectedBlog && (
              <div className="font-poppins rounded-3xl w-[250px] h-[500px] md:w-[550px] md:h-[300px] lg:w-[600px] lg:h-[500px] flex flex-col">
                <div className="flex justify-between items-center text-center flex-col">
                  <div className="text-3xl font-bold my-2 ">
                    {selectedBlog.blogName}
                  </div>
                  <hr className="border-2 border-gray-300 w-[250px] rounded-xl" />
                </div>
                <DialogContent>
                  <div>
                    <div className="underline text-xl">Content:</div>
                    <p className="my-1" dangerouslySetInnerHTML={{ __html: selectedBlog.content }}/>
                    <hr className="border-2 border-gray-300 rounded-xl" />
                  </div>
                  <div className="md:flex md:flex-row justify-between">
                    <div>
                      <div className="underline text-xl">Author:</div>
                      <div className="my-1">{selectedBlog.author}</div>
                    </div>
                    <div>
                      <div className="underline text-xl">Date:</div>
                      <div className="my-1">{selectedBlog.date}</div>
                    </div>
                  </div>
                  <hr className="border-2 border-gray-300 rounded-xl" />
                  <input
                    type="checkbox"
                    className="border-[2px] border-gray-300 rounded-md"
                    id="isSpecial"
                    checked={selectedBlog.isSpecial}
                    readOnly
                  />
                  <label htmlFor="isSpecial" className="font-bold px-2">
                    ShowCase
                  </label>
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
    );
  
}

export default BlogsPanel;
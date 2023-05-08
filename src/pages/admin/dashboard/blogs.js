import { DataGrid } from "@mui/x-data-grid";
import CustomDataGrid from "../../../components/customDataGrid";
import { useState, useEffect, useMemo } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import axios from "axios";

export default function AdminBlogs({ blogs }) {
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
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");

  useEffect(() => {
    setBlogId(selectedBlogForUpdate?.id || "");
    setTitle(selectedBlogForUpdate?.blogName || "");
    setContent(selectedBlogForUpdate?.content || "");
    setBlogTags(selectedBlogForUpdate?.blogTags || []);
    setAuthor(selectedBlogForUpdate?.author || "");
    setDate(selectedBlogForUpdate?.date || "");
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
        setSelectedBlogForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/updateBlogById/${selectedBlogForUpdate.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/addNewBlog`,
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
    <>
      <div className="md:mt-10 mt-24 mb-2 flex flex-row justify-between">
        <div className="text-3xl">Blogs</div>
        <button
          className="py-2 px-4 bg-orange-400 rounded-md"
          onClick={handleAddFormOpen}
        >
          + Add New Blog
        </button>
      </div>
      <div
        
        className="w-full bg-white shadow-lg "
      >
        <CustomDataGrid data={rows} columns={columns} />
        <Dialog open={addNewForm} onClose={handleAddFormClose}>
          <div className="p-4">
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
              <textarea
                id="content"
                placeholder="What's on your mind?"
                className="w-full border-[2px] border-gray-300 rounded-md mb-3 px-4 py-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>

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
          {selectedBlog && (
            <div className=" rounded-3xl w-[250px] h-[500px] md:w-[550px] md:h-[300px] lg:w-[600px] lg:h-[500px] flex flex-col">
              <div className="flex justify-between items-center text-center flex-col">
                <div className="text-3xl font-bold my-2 ">
                  {selectedBlog.blogName}
                </div>
                <hr className="border-2 border-gray-300 w-[250px] rounded-xl" />
              </div>
              <DialogContent>
                <div>
                  <div className="underline text-xl">Content:</div>
                  <div className="my-1">{selectedBlog.content}</div>
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
    </>
  );
}

export async function getStaticProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getAllBlogs`
  );
  const blogs = res.data;
  return {
    props: {
      blogs,
    },
  };
}

import CustomDataGrid from "../../components/customDataGrid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

const TestimonialsPanel = ({ testimonials }) => {
  const [testimonialId, setTestimonialId] = useState("");
  const [name, setName] = useState("");
  const [testimonialHeading, setTestimonialHeading] = useState("");
  const [testimonialData, setTestimonialData] = useState("");
  const [stars, setStars] = useState(0);
  const [selectedTestimonialForUpdate, setSelectedTestimonialForUpdate] =
    useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");

  useEffect(() => {
    setTestimonialId(selectedTestimonialForUpdate?.id || "");
    setName(selectedTestimonialForUpdate?.testimonialName || "");
    setTestimonialHeading(
      selectedTestimonialForUpdate?.testimonialHeading || ""
    );
    setTestimonialData(selectedTestimonialForUpdate?.testimonialData || "");
    setStars(selectedTestimonialForUpdate?.stars || 0);
  }, [selectedTestimonialForUpdate]);

  const [rows, setRows] = useState(
    testimonials.map((testimonial) => ({
      id: testimonial._id,
      testimonialName: testimonial.name,
      testimonialHeading: testimonial.testimonialHeading,
      testimonialData: testimonial.testimonialData,
      stars: testimonial.stars,
    }))
  );

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}testimonials/getAllTestimonials`
      );
      setRows(
        response.data.map((testimonial) => ({
          id: testimonial._id,
          testimonialName: testimonial.name,
          testimonialHeading: testimonial.testimonialHeading,
          testimonialData: testimonial.testimonialData,
          stars: testimonial.stars,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setName("");
    setTestimonialHeading("");
    setTestimonialData("");
    setStars(0);
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
      setSelectedTestimonialForUpdate(null);
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
    formData.append("name", name);
    formData.append("testimonialHeading", testimonialHeading);
    formData.append("testimonialData", testimonialData);
    formData.append("stars", stars);

    try {
      let response;
      if (isUpdate) {
        setSelectedTestimonialForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}testimonials/updateTestimonialById/${selectedTestimonialForUpdate.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}testimonials/addNewTestimonial`,
          formData
        );
      }
      fetchTestimonials();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}testimonials/deleteTestimonial/${testimonialId}`
      );
      setRows(rows.filter((row) => row.id !== testimonialId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "testimonialName",
      headerName: "Name",
      flex: 1,
      valueGetter: (params) => params.testimonialName,
    },
    {
      field: "testimonialHeading",
      headerName: "Review Heading",
      flex: 1,
      valueGetter: (params) => params.testimonialHeading,
    },
    {
      field: "stars",
      headerName: "Stars",
      flex: 1,
      valueGetter: (params) => params.stars,
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
          setSelectedTestimonialForUpdate(params);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete the review by ${params.testimonialName}?`
            )
          ) {
            deleteTestimonial(params.id);
          }
        };
        return (
          <>
            <IconButton onClick={onClickEdit}>
              <EditRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
            <IconButton onClick={onClickDelete}>
              <DeleteRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <div className="font-poppins">
      <div className="mb-2 flex flex-row justify-between items-center">
        <div className="text-3xl">Testimonial</div>
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
        <CustomDataGrid data={rows} columns={columns} autoHeight />
      </div>
      <div>
        <Dialog open={addNewForm} onClose={handleAddFormClose}>
          <div className="p-4 font-poppins">
            <div className="text-2xl font-bold pb-3">Add New Testimonial</div>
            <form>
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <input
                type="text"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="heading" className="font-bold">
                Heading
              </label>
              <input
                type="text"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="heading"
                placeholder="Enter Review Heading"
                value={testimonialHeading}
                onChange={(e) => setTestimonialHeading(e.target.value)}
              />

              <label htmlFor="testimonialData" className="font-bold">
                Content
              </label>
              <textarea
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="testimonialData"
                placeholder="Enter Content"
                value={testimonialData}
                onChange={(e) => setTestimonialData(e.target.value)}
              />

              <label htmlFor="stars" className="font-bold">
                Stars
              </label>
              <input
                type="number"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="stars"
                placeholder="Enter Stars"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                min={0}
                max={5}
              />
            </form>
          </div>
          <DialogActions>
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
      </div>
    </div>
  );
};

export default TestimonialsPanel;

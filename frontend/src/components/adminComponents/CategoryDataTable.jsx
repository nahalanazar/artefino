import { useState } from "react";
import { Button, Modal, Table, Form as BootstrapForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAddCategoryMutation, useUpdateCategoryByAdminMutation, useUnListCategoryByAdminMutation, useReListCategoryByAdminMutation } from "../../slices/adminApiSlice";
import PropTypes from 'prop-types';

const CategoriesDataTable = ({ categories, setCategoriesData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State for the confirmation dialog
  const [categoryIdToUnList, setCategoryIdToUnList] = useState(null); // Track the category ID to block
  const [categoryIdToReList, setCategoryIdToReList] = useState(null); // Track the category ID to unblock

  const [showUpdateModal, setShowUpdateModal] = useState(false); // State for the update modal
  const [categoryIdToUpdate, setCategoryIdToUpdate] = useState("");
  const [categoryNameToUpdate, setCategoryNameToUpdate] = useState("");
  const [categoryDescriptionToUpdate, setCategoryDescriptionToUpdate] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };


  const filteredCategories = categories
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

    const [addCategory] = useAddCategoryMutation();
    const [updateCategoryByAdmin, { isLoading: isUpdating }] = useUpdateCategoryByAdminMutation();
    const [UnListCategoryByAdmin, { isLoading: isUnListing }] = useUnListCategoryByAdminMutation();
    const [ReListCategoryByAdmin, { isLoading: isReListing }] = useReListCategoryByAdminMutation();

  const handleOpenAddCategoryModal = () => {
    setNewCategoryName(""); 
    setNewCategoryDescription(""); 
    setShowAddModal(true);
  };

  const handleCloseAddCategoryModal = () => {
    setShowAddModal(false);
  };

  const handleAddCategory = async () => {
    try {
      const categoryData = {
        name: newCategoryName,
        description: newCategoryDescription,
      };
      const response = await addCategory(categoryData);
      if (response.data.result) {
        toast.success("Category Added Successfully.");
        setCategoriesData(prevCategories => [...prevCategories, response.data.result]);

        setShowAddModal(false);
      } else {
        toast.error(response.error.data.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleUnList = async () => {
    try {
      await UnListCategoryByAdmin({ categoryId: categoryIdToUnList });
      toast.success("Category Blocked Successfully.");
      setCategoryIdToUnList(null); 
      setShowConfirmation(false); 

      setCategoriesData(prevCategories => {
        return prevCategories.map(category =>
          category._id === categoryIdToUnList ? { ...category, isListed: false } : category
        );
      });

    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleReList = async () => {
    try {
      await ReListCategoryByAdmin({ categoryId: categoryIdToReList });
      toast.success("Category Un Blocked Successfully.");
      setCategoryIdToReList(null); 
      setShowConfirmation(false); 

      setCategoriesData(prevCategories => {
        return prevCategories.map(category =>
          category._id === categoryIdToReList ? { ...category, isListed: true } : category
        );
      });
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleOpenUpdateModal = (category) => {
    setCategoryIdToUpdate(category._id)
    setCategoryNameToUpdate(category.name);
    setCategoryDescriptionToUpdate(category.description)
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    try {
      const responseFromApiCall = await updateCategoryByAdmin({
        categoryId: categoryIdToUpdate,
        name: categoryNameToUpdate,
        description: categoryDescriptionToUpdate,
      });
      if (responseFromApiCall.data) {
        toast.success("Category Updated Successfully.");
        setCategoriesData(prevCategories => {
          return prevCategories.map(category =>
            category._id === categoryIdToUpdate ? { ...category, name: categoryNameToUpdate, description: categoryDescriptionToUpdate } : category
          );
        });

        setShowUpdateModal(false);

      } else {
        toast.error(responseFromApiCall.error.data.message); 
      }
      setCategoryIdToUpdate(null);
      setShowUpdateModal(false); 

    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <>
      <BootstrapForm>
        <BootstrapForm.Group
          className="mt-3"
          controlId="exampleForm.ControlInput1"
        >
          <BootstrapForm.Label>Search categories:</BootstrapForm.Label>
          <BootstrapForm.Control
            style={{ width: "500px" }}
            value={searchQuery}
            type="text"
            placeholder="Enter Name or Description........"
            onChange={handleSearch}
          />
        </BootstrapForm.Group>
      </BootstrapForm>

      <Button
        type="button"
        variant="primary"
        className="mt-3 mb-3"
        onClick={() => handleOpenAddCategoryModal()}
      >
        Add Category
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>SI No.</th>
            <th>Name</th>
            <th>Description</th>
            <th>Update</th>
            <th>Status</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleOpenUpdateModal(category)}
                >
                  Update
                </Button>
              </td>
              <td>
                {category.isListed === true ? (
                  <span className="text-success" style={{ fontWeight: "bold" }}>Listed</span>
                ) : (
                  <span className="text-danger" style={{ fontWeight: "bold" }}>Unlisted</span>
                )}
              </td>
              <td>
                {category.isListed === true ? (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        setCategoryIdToUnList(category._id); 
                        setShowConfirmation(true); 
                      }}
                    >
                      UnList
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => {
                        setCategoryIdToReList(category._id); 
                        setShowConfirmation(true); 
                      }}
                    >
                      ReList
                    </Button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirmation Dialog */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoryIdToUnList ? (
            <>
              Are you sure you want to Un List this category?
              <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleUnList} disabled={isUnListing}>
                {isUnListing ? "UnListing..." : "UnList"}
              </Button>
            </>
          ) : categoryIdToReList ? (
            <>
              Are you sure you want to re list this category?
              <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleReList} disabled={isReListing}>
                {isReListing ? "ReListing..." : "ReList"}
              </Button>
            </>
          ) : null}
        </Modal.Body>
      </Modal>

      {/* Update Category Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="name">
              <BootstrapForm.Label>Name</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={categoryNameToUpdate}
                name="name"
                onChange={(e) =>
                    setCategoryNameToUpdate(e.target.value)
                }
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="Description">
              <BootstrapForm.Label>Description</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={categoryDescriptionToUpdate}
                onChange={(e) =>
                    setCategoryDescriptionToUpdate(e.target.value)
                }
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={handleCloseAddCategoryModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="newCategoryName">
              <BootstrapForm.Label>Name</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={newCategoryName}
                name="name"
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter Category name"
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="newCategoryDescription">
              <BootstrapForm.Label>Description</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={newCategoryDescription}
                name="description"
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Enter Description"
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddCategoryModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

CategoriesDataTable.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      isListed: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default CategoriesDataTable;

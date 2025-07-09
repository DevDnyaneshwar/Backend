import { Property } from "../models/property.model.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from "fs/promises";

const createproperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      district,
      zipcode,
      location,
      rent,
      propertyType,
      noOfBedroom,
      images,
    } = req.body;

    let imageUrl = "";
    if (req.file) {
      try {
        imageUrl = await uploadImage(req.file);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    if (
      !title ||
      !city ||
      !district ||
      !zipcode ||
      !rent ||
      !propertyType ||
      !noOfBedroom ||
      !location
    ) {
      return res.status(400).json("Please fill all required fields");
    }

    const newProperty = new Property({
      title,
      description,
      address,
      city,
      district,
      zipcode,
      location,
      rent,
      propertyType,
      noOfBedroom,
      images: imageUrl,
    });
    await newProperty.save();

    res.status(201).json({newProperty:{image:imageUrl}});
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const propertyI = req.property.id;

    const propertyId = req.params.id;
    const updates = req.body;

    if (!propertyI) {
      return res.status(401).json("USer not authenticated");
    }

    //finding property
    const property = await Property.findById(propertyId);
    if (!property) {
      return sendError(
        res,
        new Error("Property not found"),
        "Property not found",
        404
      );
    }

    // Authorization
    if (property.owner.toString() !== propertyI.toString()) {
      return sendError(
        res,
        new Error("Unauthorized"),
        "You are not authorized to update this property.",
        403
      );
    }

    //
    if (updates.location !== undefined) {
      updates.location = {
        type: String,
      };
      delete updates.location;
    }

    if (req.file) {
      // Delete old photo if exists
      const property = await Property.findById(propertyI);
      if (property && property.photo) {
        // Extract public_id from the URL (assuming Cloudinary)
        const publicId = property.image.split("/").pop().split(".")[0];
        await deleteImage(publicId);
      }

      const result = await uploadImage(req.file.path);
      updateData.image = result.secure_url;
      // Remove the temp file
      fs.unlinkSync(req.file.path);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: updates },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      property: updatedProperty,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error('Error in updateProperty:', error);
    res.status(500).json({ message: 'Server error, please try again later' })
    }
};

const deleteProperty = async (req, res) => {
    try {
        if (!req.property || !req.property.id) {
            return res.status(401).json('User not authenticated')
        }
        const propertyI = req.property.id;
        const userRole = req.property.role;

        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json('Property not found')
        }

        // Authorization
        if (property.owner.toString() !== propertyI.toString() ) {
            return res.status(404).json('Unauthorised')
        }

        await Property.findByIdAndDelete(propertyId);
        res.status(201).json('Property delete successfully')
    } catch (error) {
        res.status(404).json('failed to delete Property', error)
    }
};

export {createproperty, updateProperty, deleteProperty}
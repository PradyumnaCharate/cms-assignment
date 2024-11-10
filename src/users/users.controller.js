const User = require("./users.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const UserService = require("./users.service");

const {
  RolepermissionsmappingService,
  Rolepermissionsmapping,
} = require("../rolePermissionsMappings");
const { Role } = require("../roles");
const {
  imageUpload,
  imageMultipleUpload,
  videoMultipleUpload,
  documentsMultipleUpload,
  documentSingleUpload,
  resizeAndConvertToWebp,
} = require("../../utils/fileUploadHandler");
const rolepermissionsmappingService = new RolepermissionsmappingService(
  Rolepermissionsmapping
);
const userService = new UserService(User);

class userController extends Controller {
  constructor(service, rolepermissionsmappingService) {
    super(service);
    this.rolepermissionsmappingService = rolepermissionsmappingService;
  }

  login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password.", 400));
    }
    const user = await this.service.login(email, password);
    if (!user) {
      return next(new ErrorHandler("Invalid email or password!", 401));
    }
    const token = user.getJWTToken();

    const { items } = await this.rolepermissionsmappingService.getMyPermissions(
      user.role?.id
    );

    new responseHandler(
      { user, token, permissions: items },
      "Log in Successful!",
      200
    ).sendResponse(res);
  });

  getAll = catchAsyncError(async (req, res, next) => {
    req.query.populate = [{ model: Role, as: "role" }];

    const items = await this.service.getAll(req.query);
    if (!items) {
      return next(new ErrorHandler("No Users added", 404));
    }
    new responseHandler(items, "Fetched Successfully!", 200).sendResponse(res);
  });

  getById = catchAsyncError(async (req, res, next) => {
    const populate = [];
    req.query?.view === "true"
      ? populate.push({ model: Role, as: "role" })
      : null;

    const item = await this.service.getById(req.params.id, populate);
    if (!item) {
      return next(new ErrorHandler("User Not Found", 404));
    }
    new responseHandler(item, "Fetched Successfully!", 200).sendResponse(res);
  });

  getRefreshToken = catchAsyncError(async (req, res, next) => {
    const { userId } = jwt.verify(
      req.body.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const accessToken = jwt.sign(
      { userId: userId },
      process.env.ACCESSS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      }
    );
    new responseHandler(
      { accessToken },
      "Created Successfully!",
      200
    ).sendResponse(res);
  });

  uploadMultipleImages = catchAsyncError(async (req, res, next) => {
    await imageMultipleUpload(req, res, async (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 401));
      }

      const files = req.files;
      const fileUrls = [];

      for (const file of files) {
        await resizeAndConvertToWebp(file);
        fileUrls.push(`images/${file.filename}`);
      }
      new responseHandler(
        { location: fileUrls },
        "Files uploaded successfully!",
        201
      ).sendResponse(res);
    });
  });

  uploadSingleImage = catchAsyncError(async (req, res, next) => {
    await imageUpload(req, res, (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 401));
      }
      const fileUrl = `images/${req.file.filename}`;
      new responseHandler(
        { location: fileUrl },
        "File uploaded successfully!",
        201
      ).sendResponse(res);
    });
  });

  uploadMultipleVideos = catchAsyncError(async (req, res, next) => {
    await videoMultipleUpload(req, res, (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 401));
      }
      const fileUrls = req.files.map((file) => `videos/${file.filename}`);
      new responseHandler(
        { location: fileUrls },
        "Files uploaded successfully!",
        201
      ).sendResponse(res);
    });
  });

  uploadSingleVideo = catchAsyncError(async (req, res, next) => {
    await videoMultipleUpload(req, res, (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 401));
      }
      const fileUrl = `videos/${req.file.filename}`;
      new responseHandler(
        { location: fileUrl },
        "File uploaded successfully!",
        201
      ).sendResponse(res);
    });
  });

  uploadMultipleDocuments = catchAsyncError(async (req, res, next) => {
    await documentsMultipleUpload(req, res, (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 401));
      }
      console.log(req.files);
      const fileUrls = req.files.map((file) => `documents/${file.filename}`);
      new responseHandler(
        { location: fileUrls },
        "Files uploaded successfully!",
        201
      ).sendResponse(res);
    });
  });

  uploadSingleDocument = catchAsyncError(async (req, res, next) => {
    await documentSingleUpload(req, res, (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 401));
      }

      const fileUrl = `documents/${req.file.filename}`;
      new responseHandler(
        { location: fileUrl },
        "File uploaded successfully!",
        201
      ).sendResponse(res);
    });
  });
}

module.exports = new userController(userService, rolepermissionsmappingService);

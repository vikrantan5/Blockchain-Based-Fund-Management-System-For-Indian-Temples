// import mongoose, { Schema } from "mongoose";

// const transactionSchema = new Schema(
//   {
//     transactionType: {
//       type: String,
//       enum: ["transfer", "temple-registration", "withdrawal"],
//       required: true,
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true, // always required
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: function () {
//         return this.transactionType !== "withdrawal";
//       },
//     },
//     amount: {
//       type: Number,
//       required: function () {
//         // required for transfer and withdrawal only
//         return this.transactionType !== "temple-registration";
//       },
//       min: 0,
//     },
//     txHash: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "failed"],
//       default: "pending",
//     },
//     gasPrice: {
//       type: Number,
//       required: true,
//     },
//     transactionFee: {
//       type: Number,
//       required: true,
//     },
//     purpose: {
//       type: String,
//       required: function () {
//         // required for transfer and withdrawal only
//         return this.transactionType !== "temple-registration";
//       },
//     },
//     cryptoType: {
//       type: String,
//       required: true,
//       default: "matic",
//       lowercase: true, // Assuming MATIC for now, can be dynamic later
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Transaction = mongoose.model("Transaction", transactionSchema);













import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      enum: ["donation", "ngo-registration", "withdrawal"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // always required
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.transactionType !== "withdrawal";
      },
    },
    amount: {
      type: Number,
      required: function () {
        // required for donation and withdrawal only
        return this.transactionType !== "ngo-registration";
      },
      min: 0,
    },
    txHash: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    gasPrice: {
      type: Number,
      required: true,
    },
    transactionFee: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: function () {
        // required for donation and withdrawal only
        return this.transactionType !== "ngo-registration";
      },
    },
    cryptoType: {
      type: String,
      required: true,
      default: "matic",
      lowercase: true,
    },
    isSimulated: {
      type: Boolean,
      default: true,
      required: true,
    },
    network: {
      type: String,
      enum: ["polygon-amoy", "polygon-mumbai", "ethereum-sepolia", "localhost"],
      default: "polygon-amoy",
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);

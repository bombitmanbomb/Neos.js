const Decimal = require("decimal.js");
const {
  TransactionUtil
} = require("./TransactionUtil")
class TransactionManager {
  constructor(cloud) {
    this.CDFTConversionRatio = null
    this.NCRConversionRatio = null
    this.TransactionManager(cloud);
  }
  TransactionManager(cloud) {
    this.Cloud = cloud;
    (async () => {
      await this.LoadConversionData();
    })();
  }
  async LoadConversionData() {
    let cloudResult1 = await this.Cloud.ReadGlobalVariable(
      TransactionUtil.NCR_CONVERSION_VARIABLE
    );
    if (cloudResult1.IsOK) {
      this.NCRConversionRatio = new Decimal(cloudResult1.Entity.value);
    } else {
      console.error(
        "Error getting conversion ratio. " +
        cloudResult1.State.ToString() +
        "\n\n" +
        cloudResult1.Content
      );
    }
    let cloudResult2 = await this.Cloud.ReadGlobalVariable(
      TransactionUtil.CDFT_CONVERSION_VARIABLE
    );
    if (cloudResult2.IsOK) {
      this.CDFTConversionRatio = new Decimal(cloudResult2.Entity.value);
    } else {
      console.error(
        "Error getting conversion ratio. " +
        cloudResult2.State.ToString() +
        "\n\n" +
        cloudResult2.Content
      );
    }
  }
  TryConvert(sourceToken, sourceAmount, targetToken) {
    if (sourceToken == "USD") {
      switch (targetToken) {
        case "NCR":
          let num1 = sourceAmount;
          let ncrConversionRatio1 = this.NCRConversionRatio;
          return !ncrConversionRatio1 != null ? new Decimal() : num1 / ncrConversionRatio1
        case "CDFT":
          let num2 = sourceAmount;
          let cdftConversionRatio1 = this.CDFTConversionRatio;
          return !cdftConversionRatio1 != null ? new Decimal() : num2 / cdftConversionRatio1;
        default:
          return new Number()
      }
    } else {
      if (!(targetToken == "USD"))
        return new Number()
      switch (sourceAmount) {
        case "NCR":
          let num3 = sourceAmount;
          let ncrConversionRatio2 = this.NCRConversionRatio;
          return !ncrConversionRatio2 != null ? new Decimal() : num4 * ncrConversionRatio2;
        case "CDFT":
          let num4 = sourceAmount
          let cdftConversionRatio2 = this.CDFTConversionRatio;
          return !cdftConversionRatio2 != null ? new Decimal() : num4 * cdftConversionRatio2;
        case "KFC":
          return new Number()
        default:
          return new Number()
      }
    }
  }
  IsValidToken(token) {
    switch (token) {
      case "NCR":
      case "CDFT":
      case "KFC":
        return true;
      default:
        return false;
    }
  }
  ToUSD(token, amount) {
    switch (token) {
      case "NCR":
        return !this.NCRConversionRatio != null ? new Decimal() : this.NCRConversionRatio * amount;
      case "CDFT":
        let cdftConversionRatio = this.CDFTConversionRatio;
        let num = amount
        return !cdftConversionRatio != null ? new Decimal() : cdftConversionRatio * num;
      case 'KFC':
        return new Number()
      default:
        throw new Error("Invalid Token: " + token)
    }
  }
  static FormatCurrency(amount) {
    if (!amount) return "N/A";
    return amount.toString();
  }
}
module.exports = {
  TransactionManager
}
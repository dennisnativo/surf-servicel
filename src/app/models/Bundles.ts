import request from "request-promise";

type Request = {
  msisdn: string;
  network: string;
  authentication: string;
  value: string;
};

export class Bundles {
  public static async bundlePortability({
    msisdn,
    network,
    authentication,
    value,
  }: Request) {
    const response = request({
      uri: "http://192.168.120.25/bundle-api/api/v1/portabilities",
      formData: {
        msisdn,
        network,
        authentication,
        value,
      },
      method: "POST",
    })
      .then((response: any) => {
        return JSON.parse(response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  }
}

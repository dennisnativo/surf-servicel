import sequelize from '../../database'

class Nuage {
    public static async saveOnDb({
        msisdn = null, accountId = null, iccid = null, transactionId = null, phase = null, requestBody = null, requestHeader = null, responseBody = null
      }) {
        return sequelize.query(
          `exec nuage.INS_SPEC_CONTA
          @msisdn = ?,
          @transaction_id = ?,
          @phase = ?,
          @request_body = ?,
          @request_header = ?,
          @response_body = ?,
          @created_at = ?,
          @updated_at = ?,
          @account_id = ?,
          @iccid = ?
        `,
          {
            replacements: [
              msisdn, transactionId, phase, requestBody, requestHeader, responseBody, new Date(), new Date(), accountId, iccid
            ]
          }
        )
      }
}

export default Nuage

import { z } from 'zod';

const ynabUuidRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i);
const ynabTransactionId = new RegExp(/^([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})(|_(|t_)([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])))$/i);
const iso8601ShortDate = new RegExp(/^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6]))))/i);

enum ClearedStatus {
  Uncleared = 'uncleared',
  Cleared = 'cleared',
  Reconciled = 'reconciled',
}
const ClearedStatusEnum = z.nativeEnum(ClearedStatus);

enum FlagColor {
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Green = 'green',
  Blue = 'blue',
  Purple = 'purple',
}
const FlagColorEnum = z.nativeEnum(FlagColor);

export const YnabSubTransaction = z.object({
  id: z.string().regex(ynabTransactionId),
  transaction_id: z.string().regex(ynabTransactionId),
  amount: z.number().int(),
  memo: z.string().nullable(),
  payee_id: z.string().regex(ynabUuidRegex).nullable(),
  payee_name: z.string().nullable(),
  category_id: z.string().regex(ynabUuidRegex).nullable().optional(),
  category_name: z.string(),
  transfer_account_id: z.string().regex(ynabUuidRegex).nullable(),
  transfer_transaction_id: z.string().nullable(),
  deleted: z.boolean(),
});
export type YnabSubTransaction = z.infer<typeof YnabSubTransaction>;

export const YnabTransaction = z.object({
  id: z.string().regex(ynabTransactionId),
  date: z.string().regex(iso8601ShortDate),
  amount: z.number().int(),
  memo: z.string().nullable(),
  cleared: ClearedStatusEnum,
  approved: z.boolean(),
  flag_color: FlagColorEnum.nullable(),
  account_id: z.string().regex(ynabUuidRegex),
  account_name: z.string(),
  payee_id: z.string().regex(ynabUuidRegex).nullable(),
  payee_name: z.string().nullable(),
  category_id: z.string().regex(ynabUuidRegex).nullable().optional(),
  category_name: z.string(),
  transfer_account_id: z.string().regex(ynabUuidRegex).nullable(),
  transfer_transaction_id: z.string().nullable(),
  matched_transaction_id: z.string().nullable(),
  import_id: z.string().nullable(),
  deleted: z.boolean(),
  subtransactions: z.array(YnabSubTransaction),
});
export type YnabTransaction = z.infer<typeof YnabTransaction>;

export const YnabTransactions = z.array(YnabTransaction);
export type YnabTransactions = z.infer<typeof YnabTransactions>;

export const YnabTransactionResponse = z.object({
  data: z.object({
    transactions: YnabTransactions,
    server_knowledge: z.number().int()
  }),
});
export type YnabTransactionResponse = z.infer<typeof YnabTransactionResponse>;

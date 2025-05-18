import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import React, { useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, today } from "@internationalized/date";
import { NewTransactionFormData } from "@/types/api/NewTransactionFormData";
import { CATEGORIES, CURRENCIES } from "@/types/constants/constants";

type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: NewTransactionFormData) => void;
};

export default function NewTransactionFormModal({
  isOpen,
  onClose,
  onSave,
}: ModalFormProps) {
  const [form, setForm] = useState({
    isExpense: true,
    title: "",
    amount: "",
    currency: "",
    date: today(getLocalTimeZone()),
    category: "",
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader>Add new transaction</ModalHeader>
        <ModalBody>
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">Is Expense?</span>
            <Switch
              checked={form.isExpense}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  isExpense: !prev.isExpense,
                }))
              }
            />
          </div>

          <Input
            isRequired
            isClearable
            label="Title"
            name="title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            onClear={() => setForm((prev) => ({ ...prev, title: "" }))}
          />

          <Input
            isRequired
            isClearable
            label="Amount"
            name="amount"
            placeholder="0.00"
            type="number"
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amount: e.target.value }))
            }
            onClear={() => setForm((prev) => ({ ...prev, amount: "" }))}
          />

          <Select
            label="Currency"
            selectedKeys={[form.currency]}
            onSelectionChange={(keys) =>
              setForm((prev) => ({
                ...prev,
                currency: Array.from(keys)[0].toString(),
              }))
            }
          >
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency}>{currency}</SelectItem>
            ))}
          </Select>

          <Select
            label="Category"
            selectedKeys={[form.category]}
            onSelectionChange={(keys) =>
              setForm((prev) => ({
                ...prev,
                category: Array.from(keys)[0].toString(),
              }))
            }
          >
            {CATEGORIES.map((category) => (
              <SelectItem key={category}>{category}</SelectItem>
            ))}
          </Select>

          <div>
            <I18nProvider locale="pl-PL">
              <DatePicker
                showMonthAndYearPickers
                variant="bordered"
                labelPlacement="inside"
                firstDayOfWeek="mon"
                label="Transaction date"
                value={form.date}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, date: date! }))
                }
              />
            </I18nProvider>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onPress={() =>
              onSave({
                isExpense: form.isExpense,
                title: form.title,
                amount: form.amount,
                currency: form.currency,
                date: form.date.toString(),
                category: form.category,
              })
            }
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

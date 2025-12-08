"use client";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CancelTicketModal from "./CancelTicketModal";
import EditTicketModal from "./EditTicketModal";

type TicketControlsProps = {
  ticketId: number;
  ticketData: any;
  token: string;
};

const TicketControls = ({
  ticketId,
  ticketData,
  token,
}: TicketControlsProps) => {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div>
      <div className="mt-5 flex justify-between items-center">
        <button
          className="flex items-center text-xl gap-2 text-green-600 hover:text-green-800 transition"
          onClick={() => setIsEditOpen(true)}
        >
          <FaEdit />
        </button>

        <button
          className="flex items-center text-xl gap-2 text-red-600 hover:text-red-800 transition"
          onClick={() => setIsCancelOpen(true)}
        >
          <FaTrash />
        </button>
      </div>

      {isCancelOpen && (
        <CancelTicketModal
          ticketId={ticketId}
          onClose={() => setIsCancelOpen(false)}
          token={token}
        />
      )}

      {isEditOpen && (
        <EditTicketModal
          token={token}
          ticketId={ticketId}
          ticketData={ticketData}
          onClose={() => setIsEditOpen(false)}
          eventId={ticketData.eventId}
        />
      )}
    </div>
  );
};

export default TicketControls;

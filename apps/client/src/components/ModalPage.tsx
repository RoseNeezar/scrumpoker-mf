import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment } from "react";
import { useMatch, useNavigate } from "react-router-dom";

type Props = {
  backPath: string;
  renderPath: string;
  body: React.ReactNode;
  isPage: boolean;
  show?: boolean;
  onClose?: (open: boolean) => void;
};

const ModalPage = (props: Props) => {
  const match = useMatch(props.renderPath);

  const navigate = useNavigate();

  return (
    <Transition.Root
      appear={props.isPage}
      show={props.isPage ? !!match : props.show}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() =>
          props.isPage ? navigate(props.backPath) : props!.onClose!(true)
        }
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-20 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-0 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-transparent shadow-2xl transition-all">
                {props.body}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalPage;

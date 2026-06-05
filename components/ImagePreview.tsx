"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Trash2 } from "lucide-react";
import { ImageItem } from "@/app/page";

interface Props {
  images: ImageItem[];
  setImages: React.Dispatch<
    React.SetStateAction<ImageItem[]>
  >;
}

export default function ImagePreview({
  images,
  setImages,
}: Props) {
  const removeImage = (index: number) => {
    setImages(
      images.filter((_, i) => i !== index)
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  };

  const handleDragEnd = (
    result: DropResult
  ) => {
    if (!result.destination) return;

    const items = Array.from(images);

    const [reorderedItem] =
      items.splice(
        result.source.index,
        1
      );

    items.splice(
      result.destination.index,
      0,
      reorderedItem
    );

    setImages(items);
  };

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-6">
        Uploaded Images
      </h2>

      <p className="text-muted-foreground mb-8">
        Drag cards to change PDF page order
      </p>

      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        <Droppable
          droppableId="images"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-6
              "
            >
              {images.map(
                (img, index) => (
                  <Draggable
                    key={img.preview}
                    draggableId={
                      img.preview
                    }
                    index={index}
                  >
                    {(
                      provided
                    ) => (
                      <div
                        ref={
                          provided.innerRef
                        }
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="
                          group
                          rounded-2xl
                          overflow-hidden
                          border
                          bg-card
                          shadow-md
                          hover:shadow-xl
                          transition-all
                          cursor-grab
                        "
                      >
                        <div
                          className="
                          bg-indigo-600
                          text-white
                          text-center
                          py-2
                          font-semibold
                          "
                        >
                          Page{" "}
                          {index + 1}
                        </div>

                        <img
                          src={
                            img.preview
                          }
                          alt={
                            img.name
                          }
                          className="
                            h-56
                            w-full
                            object-cover
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        />

                        <div className="p-4">
                          <p className="truncate font-medium">
                            {img.name}
                          </p>

                          <p className="text-sm text-muted-foreground mt-1">
                            {formatSize(
                              img.file
                                .size
                            )}
                          </p>

                          <button
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="
                              mt-4
                              w-full
                              flex
                              items-center
                              justify-center
                              gap-2
                              bg-red-500
                              hover:bg-red-600
                              text-white
                              py-2
                              rounded-lg
                            "
                          >
                            <Trash2
                              size={
                                16
                              }
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                )
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}
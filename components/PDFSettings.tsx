"use client";

interface Props {
  pageSize: "a4" | "letter";
  setPageSize: React.Dispatch<
    React.SetStateAction<
      "a4" | "letter"
    >
  >;

  orientation: "p" | "l";
  setOrientation: React.Dispatch<
    React.SetStateAction<
      "p" | "l"
    >
  >;
}

export default function PDFSettings({
  pageSize,
  setPageSize,
  orientation,
  setOrientation,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-12">

      <div>
        <label className="block mb-2">
          Page Size
        </label>

        <select
          value={pageSize}
          onChange={(e) =>
            setPageSize(
              e.target
                .value as
                | "a4"
                | "letter"
            )
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="a4">
            A4
          </option>

          <option value="letter">
            Letter
          </option>
        </select>
      </div>

      <div>
        <label className="block mb-2">
          Orientation
        </label>

        <select
          value={orientation}
          onChange={(e) =>
            setOrientation(
              e.target
                .value as
                | "p"
                | "l"
            )
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="p">
            Portrait
          </option>

          <option value="l">
            Landscape
          </option>
        </select>
      </div>

    </div>
  );
}
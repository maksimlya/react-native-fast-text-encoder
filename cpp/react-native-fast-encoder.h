#ifndef FASTOPENPGP_H
#define FASTOPENPGP_H

#include <jsi/jsilib.h>
#include <jsi/jsi.h>

using namespace facebook;

namespace fastEncoder {
    void install(facebook::jsi::Runtime &jsiRuntime);

    void cleanup();

    jsi::Value call(jsi::Runtime &runtime, const jsi::String &nameValue,
                             const jsi::Object &payloadObject);
}

#endif /* FASTOPENPGP_H */